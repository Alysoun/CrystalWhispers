import React, { useState, useEffect, useRef } from 'react';
import CommandPrompt from './components/CommandPrompt/CommandPrompt';
import DungeonMap from './components/Map/DungeonMap';
import Inventory from './components/Inventory/Inventory';
import GameOutput from './components/GameOutput/GameOutput';
import ImageDisplay from './components/ImageDisplay/ImageDisplay';
import Journal from './components/Journal/Journal';
import { parseCommand, getCommandType, findItem } from './game/CommandParser';
import { saveGame, loadGame, hasSavedGame } from './utils/SaveLoadManager';
import { MAX_MESSAGES } from './utils/constants';
import { Dungeon } from './game/DungeonGenerator';
import Help from './components/Help/Help';
import Player from './game/Player';
import PlayerStats from './components/PlayerStats/PlayerStats';
import Combat from './components/Combat/Combat';
import DebugMenu from './components/DebugMenu/DebugMenu';
import AchievementUI from './components/AchievementUI/AchievementUI';
import AchievementNotification from './components/AchievementNotification/AchievementNotification';
import { Achievements } from './game/Achievements';
import './App.css';
import SplashScreen from './components/SplashScreen/SplashScreen';
import { Story } from './game/Story';
import PuzzleUI from './components/PuzzleUI/PuzzleUI';
import MemoriesUI from './components/MemoriesUI/MemoriesUI';
import { Memories } from './game/Memories';
import { soundManager } from './utils/SoundManager';
import TrapUI from './components/TrapUI/TrapUI';

// Define initial game state
const initialGameState = {
  player: new Player(),
  dungeon: new Dungeon(50, 50, Math.floor(Math.random() * 15) + 15),
  inventory: [],
  gameOutput: [],
  journalEntries: [],
  memoryFragments: 0,
  permanentUpgrades: {},
  unlockedStats: {},
  stats: {
    roomsExplored: 0,
    itemsCollected: 0,
    puzzlesSolved: 0,
    enemiesDefeated: 0,
    deaths: 0,
    perfectPuzzles: 0,
    totalFragments: 0,
    helpUsed: false
  },
  isDead: false,
  playerPosition: { x: 25, y: 25 },  // Starting position
  discoveredTreasures: new Set(),
  unlockedAchievements: new Set()
};

const generateDungeon = (level = 1) => {
  const minRooms = 15;
  const maxRooms = 30;
  const numRooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
  const newDungeon = new Dungeon(50, 50, numRooms);
  
  // Set starting room as discovered
  const startingRoom = newDungeon.rooms.get(0);
  startingRoom.discovered = true;
  startingRoom.createItemsFromFeatures();
  
  // Set dungeon level
  newDungeon.level = level;
  
  return newDungeon;
};

function App() {
  const [gameState, setGameState] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  // Add state for help modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Add state for combat
  const [isCombatOpen, setIsCombatOpen] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState(null);

  // Add state
  const [showDebugMenu, setShowDebugMenu] = useState(false);

  // Add state for achievements
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Add state for achievement notifications
  const [achievementNotification, setAchievementNotification] = useState(null);

  // Add state for active puzzle
  const [activePuzzle, setActivePuzzle] = useState(null);

  // Add new state
  const [showMemoriesUI, setShowMemoriesUI] = useState(false);
  const [permanentUpgrades, setPermanentUpgrades] = useState({});

  // Add state for trap UI
  const [activeTrap, setActiveTrap] = useState(null);

  const commandPromptRef = useRef(null);

  // Add focus handler
  const refocusCommandPrompt = () => {
    commandPromptRef.current?.focus();
  };

  const initializeGame = (existingUpgrades = {}, seed = null) => {
    const minRooms = 15;
    const maxRooms = 30;
    // Generate number of rooms first using the seeded RNG
    const tempDungeon = new Dungeon(50, 50, 1, 1, seed); // Temporary dungeon just for RNG
    // Use the seeded RNG to get a number between minRooms and maxRooms
    const numRooms = Math.floor(tempDungeon.random() * (maxRooms - minRooms + 1)) + minRooms;
    console.log(`Generating dungeon with ${numRooms} rooms`);
    // Create actual dungeon with the determined number of rooms
    const dungeon = new Dungeon(50, 50, numRooms, 1, seed);
    const startingRoom = dungeon.rooms.get(0);
    startingRoom.discovered = true;
    startingRoom.createItemsFromFeatures();
    
    // Create player with permanent upgrades applied
    const player = new Player();
    // Safely apply upgrades
    Object.entries(existingUpgrades || {}).forEach(([category, upgrades]) => {
      // Check if category exists
      if (Memories.categories[category]) {
        Object.entries(upgrades).forEach(([upgrade, level]) => {
          // Check if upgrade exists in category
          const upgradeInfo = Memories.categories[category].upgrades[upgrade];
          if (upgradeInfo) {
            const effect = upgradeInfo.effect(level);
            player.applyUpgrade(category, effect);
          }
        });
      }
    });
    
    setGameState({
      currentLevel: 1,
      playerPosition: { x: 0, y: 0 },
      inventory: [],
      currentRoom: startingRoom,
      gameOutput: [
        'Welcome to Crystal Whispers!', 
        ...Story.introduction,
        '\nPerhaps you can find a way to get <command>help</command>...'
      ],
      map: [],
      currentImage: null,
      journalEntries: [],
      dungeon,
      player,
      statsRevealed: false,
      stats: {
        roomsDiscovered: 0,
        combatsWon: 0,
        puzzlesSolved: 0,
        perfectPuzzles: 0,
        totalFragments: 0,
        uniqueTreasures: 0,
        bossesDefeated: []
      },
      unlockedAchievements: [],
      unlockedStats: {
        health: true,        // Bar always visible
        healthNumbers: false, // Numbers need to be unlocked
        level: false,        // Level needs to be unlocked
        experience: false,   // Experience needs to be unlocked
        attack: false,      // Attack needs to be unlocked
        defense: false      // Defense needs to be unlocked
      },
      memoryFragments: 0,
      permanentUpgrades: existingUpgrades || {},
      isDead: false
    });
    setShowSplash(false);
  };

  const handleLoadGame = () => {
    try {
      const loadedState = loadGame();
      if (loadedState) {
        // Create new Player instance and copy over saved properties
        const newPlayer = new Player();
        Object.assign(newPlayer, loadedState.player);
        loadedState.player = newPlayer;

        // Make sure all discovered rooms have their items initialized
        loadedState.dungeon.rooms.forEach(room => {
          if (room.discovered && (!room.items || room.items.length === 0)) {
            room.createItemsFromFeatures();
          }
        });

        // Ensure stats object is properly initialized
        loadedState.stats = {
          ...initialGameState.stats,  // Start with default stats
          ...loadedState.stats        // Override with saved stats
        };
        
        setGameState(loadedState);
        setShowSplash(false);
        const currentRoom = loadedState.dungeon.rooms.get(loadedState.dungeon.currentRoomId);
        addToOutput("Game loaded successfully.");
        addToOutput(currentRoom.getFullDescription());
        addJournalEntry("Game loaded");
      } else {
        addToOutput("No saved game found.");
      }
    } catch (error) {
      console.error('Error:', error);
      addToOutput("Failed to load game.");
    }
  };

  // Add effect for keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setShowDebugMenu(prev => !prev);
      }
      // Handle ESC key
      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsAchievementsOpen(false);
        setShowMemoriesUI(false);
        setActivePuzzle(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const addJournalEntry = (text) => {
    const timestamp = new Date().toLocaleTimeString();
    setGameState(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, { timestamp, text }]
    }));
  };

  const addToOutput = (message, input = '', clearScreen = false) => {
    setGameState(prev => {
      // Clear screen if requested
      const currentOutput = clearScreen ? [] : prev.gameOutput;
      
      return {
        ...prev,
        gameOutput: [
          ...currentOutput,
          ...(Array.isArray(message) ? message : [message])
        ].slice(-MAX_MESSAGES)
      };
    });
  };

  // Function to update stats and check achievements
  const updateStats = (updates) => {
    setGameState(prev => {
      const newStats = {
        ...prev.stats,
        ...updates
      };
      
      // Update state with new stats
      const newState = {
        ...prev,
        stats: newStats
      };

      // Check for new achievements
      const newAchievements = Achievements.checkAchievements(
        newStats, 
        prev.unlockedAchievements
      );

      if (newAchievements.length > 0) {
        // Add achievements and rewards
        newState.unlockedAchievements = [
          ...prev.unlockedAchievements,
          ...newAchievements.map(a => a.id)
        ];
        newState.memoryFragments = (prev.memoryFragments || 0) + 
          newAchievements.reduce((sum, a) => sum + a.reward.fragments, 0);

        // Show notification for first achievement
        setAchievementNotification(newAchievements[0]);

        // Add to journal
        newAchievements.forEach(achievement => {
          addJournalEntry(`Achievement Unlocked: ${achievement.name}`);
        });

        // First achievement hint
        if (prev.unlockedAchievements.length === 0) {
          addToOutput([
            "You've unlocked your first achievement!",
            'Type "achievements" or "a" to view all achievements.'
          ].join('\n'));
        }
      }

      return newState;
    });
  };

  // Room discovery
  const handleRoomDiscovery = (room) => {
    if (!room.discovered) {
      updateStats({
        roomsDiscovered: gameState.stats.roomsDiscovered + 1
      });
    }
  };

  // Combat victory
  const handleCombatEnd = (result) => {
    // Change to handle result as an object or string
    const victory = result === 'victory' || result.victory;
    const fled = result === 'flee' || result.fled;

    if (victory) {
        soundManager.play('victory');
        const enemy = currentEnemy;
        setCurrentEnemy(null);
        setIsCombatOpen(false);
        refocusCommandPrompt();

        // Get current room and mark it as cleared
        const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
        currentRoom.cleared = true;
        currentRoom.enemy = null;

        // Update player stats and handle experience gain
        setGameState(prev => {
            const newPlayer = new Player();
            Object.assign(newPlayer, {
                maxHealth: prev.player.maxHealth,
                health: prev.player.health,
                attack: prev.player.attack,
                defense: prev.player.defense,
                level: prev.player.level,
                experience: prev.player.experience,
                healAfterCombat: prev.player.healAfterCombat
            });
            
            const expResult = newPlayer.gainExperience(enemy.experience);
            
            const messages = [
                `You defeated the ${enemy.name}!`,
                `Gained ${enemy.experience} experience points.`
            ];

            if (expResult.levelsGained > 0) {
                messages.push(`Level Up! You are now level ${expResult.newLevel}!`);
                addJournalEntry(`Reached level ${expResult.newLevel}`);
            }

            if (newPlayer.healAfterCombat) {
                messages.push(`Recovered ${newPlayer.healAfterCombat} HP.`);
            }

            addToOutput(messages.filter(Boolean).join('\n'));
            addJournalEntry(`Defeated ${enemy.name} (+${enemy.experience} XP)`);

            return {
                ...prev,
                player: newPlayer,
                stats: {
                    ...prev.stats,
                    enemiesDefeated: (prev.stats.enemiesDefeated || 0) + 1
                }
            };
        });
    } else if (fled) {
        addToOutput("You managed to escape!");
        setIsCombatOpen(false);
        setCurrentEnemy(null);
    } else {
        // Only handle death if not victory and not fled
        setIsCombatOpen(false);
        setCurrentEnemy(null);
        handlePlayerDeath();
    }
  };

  const handleStatUnlock = (statType, cost) => {
    // Check if already unlocked
    if (gameState.unlockedStats[statType]) {
      addToOutput("You've already unlocked this stat!");
      return;
    }

    if (gameState.memoryFragments >= cost) {
      setGameState(prev => ({
        ...prev,
        memoryFragments: prev.memoryFragments - cost,
        unlockedStats: {
          ...prev.unlockedStats,
          [statType]: true
        }
      }));
      
      // Format the stat name for display
      const formattedStatName = statType === 'healthNumbers' ? 'health numbers' : statType;
      addToOutput(`You've unlocked the ability to see your ${formattedStatName}!`);
      addJournalEntry(`Unlocked ${formattedStatName} visibility`);
    } else {
      addToOutput("Not enough memory fragments to unlock this stat.");
    }
  };

  // Puzzle solving
  const handlePuzzleSolve = (puzzle, result) => {
    if (result.success) {
      updateStats({
        puzzlesSolved: gameState.stats.puzzlesSolved + 1,
        perfectPuzzles: puzzle.attempts === 1 ? 
          gameState.stats.perfectPuzzles + 1 : 
          gameState.stats.perfectPuzzles
      });
    }
  };

  // Fragment collection
  const handleFragmentGain = (amount) => {
    soundManager.play('collect_fragment');
    updateStats({
      totalFragments: gameState.stats.totalFragments + amount
    });
  };

  // Treasure finding
  const handleTreasureFound = (treasure) => {
    const uniqueTreasures = new Set([
      ...gameState.stats.uniqueTreasures,
      treasure.id
    ]);
    updateStats({
      uniqueTreasures: uniqueTreasures.size
    });
  };

  const handlePlayerDeath = () => {
    console.log('Player death triggered');
    
    // Calculate retention bonus from upgrades
    const retentionLevel = gameState.permanentUpgrades?.exploration?.retention || 0;
    const retentionBonus = retentionLevel * 0.1;  // 10% per level
    const baseRetention = 0.2;  // Base 20% retention
    const totalRetention = baseRetention + retentionBonus;
    
    // Calculate memories to keep (20% base + retention bonus)
    const memoriesToKeep = Math.floor(gameState.memoryFragments * totalRetention);
    
    console.log('Death memory calculation:', {
        original: gameState.memoryFragments,
        retentionLevel,
        retentionBonus,
        totalRetention,
        kept: memoriesToKeep
    });
    
    // Save permanent upgrades and kept memories
    setGameState(prev => {
        console.log('Death state update:', {
            memoryFragments: memoriesToKeep,
            permanentUpgrades: prev.permanentUpgrades,
            isDead: true
        });
        return {
            ...prev,
            memoryFragments: memoriesToKeep,
            permanentUpgrades: prev.permanentUpgrades || {},
            isDead: true,
            stats: {
                ...prev.stats,
                deaths: (prev.stats.deaths || 0) + 1
            }
        };
    });
    
    // Update death message to show retention bonus if any
    const retentionMessage = retentionBonus > 0 
        ? `\n(Memory Retention bonus: +${retentionBonus * 100}%)`
        : '';
        
    addToOutput([
        "Everything fades to darkness...",
        "But your memories remain, albeit fragmented...",
        `(Kept ${memoriesToKeep} memory fragments)${retentionMessage}`,
        "\nType 'continue' to return to the Memory Nexus"
    ].join('\n'));
    
    setShowMemoriesUI(true);
  };

  // Add this new function to handle continuing after death
  const handleContinue = () => {
    console.log('Handling continue after death');
    
    // Create new dungeon using the existing Dungeon class
    const newDungeon = new Dungeon(50, 50, Math.floor(Math.random() * 15) + 15);
    newDungeon.level = 1;  // Reset to level 1
    
    // Set starting room as discovered
    const startingRoom = newDungeon.rooms.get(0);
    startingRoom.discovered = true;
    startingRoom.createItemsFromFeatures();

    // Create new player and apply all permanent upgrades
    const newPlayer = new Player();
    
    // Preserve experience and level from previous run
    newPlayer.experience = gameState.player.experience;
    newPlayer.level = gameState.player.level;
    
    // Safely apply all permanent upgrades to the new player
    Object.entries(gameState.permanentUpgrades || {}).forEach(([category, upgrades]) => {
        if (Memories.categories[category] && upgrades) {  // Check if category exists
            Object.entries(upgrades).forEach(([upgrade, level]) => {
                const upgradeInfo = Memories.categories[category]?.upgrades?.[upgrade];
                if (upgradeInfo) {  // Check if upgrade exists
                    const effect = upgradeInfo.effect(level);
                    
                    // Apply the effects to the player
                    if (effect.attackBonus) newPlayer.attack += effect.attackBonus;
                    if (effect.defenseBonus) newPlayer.defense += effect.defenseBonus;
                    if (effect.healAfterCombat) newPlayer.healAfterCombat = (newPlayer.healAfterCombat || 0) + effect.healAfterCombat;
                    if (effect.healthBonus) {
                        newPlayer.maxHealth += effect.healthBonus;
                        newPlayer.health = newPlayer.maxHealth;  // Start with full health
                    }
                }
            });
        }
    });

    // Reset game state but keep memories and permanent upgrades
    setGameState(prev => ({
        ...initialGameState,  // Reset to initial state
        memoryFragments: prev.memoryFragments,  // Keep remaining fragments
        permanentUpgrades: prev.permanentUpgrades,  // Keep upgrades
        stats: prev.stats,  // Keep statistics
        unlockedStats: prev.unlockedStats,  // Keep unlocked stats
        discoveredTreasures: prev.discoveredTreasures,
        unlockedAchievements: prev.unlockedAchievements,
        player: newPlayer,  // Use the player with applied upgrades
        dungeon: newDungeon,
        currentRoom: newDungeon.rooms.get(newDungeon.currentRoomId),
        isDead: false
    }));

    setShowMemoriesUI(false);
    addToOutput("You awaken in a new memory...");
    addJournalEntry("Began new exploration");
  };

  const handleCommand = async (input) => {
    // Add new command for continuing after death
    if (gameState.isDead && input.toLowerCase() === 'continue') {
        handleContinue();
        return;
    }

    const { type, target } = parseCommand(input);
    console.log('Parsed command:', type, 'target:', target);

    // Get current room from gameState
    const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);

    switch (type) {
      case 'go':
        const direction = target;
        let canMove = false;
        let nextRoomId = null;
      
        currentRoom.connections.forEach(({ room, direction: exitDir, state }) => {
          if (exitDir === direction && state === 'open') {
            canMove = true;
            nextRoomId = room.id;
          }
        });
      
        if (canMove) {
          const nextRoom = gameState.dungeon.rooms.get(nextRoomId);
          
          // Handle trap check before movement
          if (nextRoom.trap && !nextRoom.trap.disarmed) {
            const trapResult = nextRoom.handleTrapTrigger();
            if (trapResult.triggered) {
              addToOutput(trapResult.message);
              if (trapResult.damage) {
                setGameState(prev => ({
                  ...prev,
                  player: {
                    ...prev.player,
                    health: Math.max(0, prev.player.health - trapResult.damage)
                  }
                }));
                addToOutput(`You take ${trapResult.damage} damage from the trap!`);
              }
            } else {
              addToOutput(trapResult.message);
            }
          }

          // Discover and generate loot with bonuses
          nextRoom.discover();
          nextRoom.generateLoot();
          
          handleRoomDiscovery(nextRoom);
          nextRoom.discover();
      
          if (!nextRoom.items || nextRoom.items.length === 0) {
            nextRoom.createItemsFromFeatures();
          }
      
          // Record which direction we entered from
          nextRoom.recordEntry(direction);
      
          // Check for combat
          if (nextRoom.roomType === 'combat' && (nextRoom.enemy || nextRoom.enemyType) && !nextRoom.canSneakPast(direction)) {
            const enemy = nextRoom.enemy || nextRoom.enemyType;
            const ambushState = nextRoom.getAmbushState();
            setCurrentEnemy(enemy);
            setIsCombatOpen(true);
            nextRoom.enemyAware = true;
            nextRoom.playerAware = true;
            
            switch(ambushState) {
              case 'player':
                addToOutput(`You catch the ${enemy.name} by surprise! You'll get the first strike!`, input);
                break;
              case 'enemy':
                addToOutput(`The ${enemy.name} was waiting for you! It gets the first strike!`, input);
                break;
              default:
                addToOutput(`A ${enemy.name} appears!`, input);
            }
          } else if (nextRoom.enemy && !nextRoom.enemyAware) {
            if (nextRoom.playerAware) {
              addToOutput("There's an enemy here. You've spotted it, but it hasn't noticed you yet. You can sneak back the way you came, or attack for an advantage!", input);
            } else {
              addToOutput("You sense a presence, but can't quite make it out. You can sneak back the way you came to be safe.", input);
            }
          }
      
          // Update gameState - preserve player object
          setGameState(prev => {
            const updatedDungeon = prev.dungeon;
            updatedDungeon.currentRoomId = nextRoomId;
            
            return {
              ...prev,
              dungeon: updatedDungeon,
              currentRoom: nextRoom,
              playerPosition: { x: nextRoom.x, y: nextRoom.y },
              player: prev.player  // Explicitly preserve player state
            };
          });
      
          addToOutput(nextRoom.getFullDescription(), input, true);
          addJournalEntry(`Moved ${direction} to room ${nextRoomId}`);
        } else {
          if (direction) {
            addToOutput(direction ? `You cannot go ${direction} from here.` : "Go where?", input);
          } else {
            addToOutput("Go where?", input);
          }
        }
        break;
      

      case 'look':
        if (!target) {
          addToOutput(gameState.currentRoom.getFullDescription(), input, true);
        } else {
          const item = findItem(target, gameState.currentRoom.items);
          if (item) {
            addToOutput(item.description, input, false);
          } else {
            addToOutput("You don't see that here.", input);
          }
        }
        break;

      case 'take':
        console.log('Take command initiated for:', target);
        const result = currentRoom.takeItem(target);
        console.log('Take result:', result);

        if (!result.success) {
            addToOutput(result.message);
            return;
        }

        // Update game state and show new room description
        setGameState(prev => ({
            ...prev,
            dungeon: {
                ...prev.dungeon,
                rooms: new Map(prev.dungeon.rooms).set(currentRoom.id, currentRoom)
            },
            memoryFragments: prev.memoryFragments + result.fragments
        }));

        addToOutput(result.message);
        // Add journal entry for the taken item
        if (result.fragments) {
            addJournalEntry(`Acquired ${result.item.name} (+${result.fragments} fragments)`);
        } else {
            addJournalEntry(`Acquired ${result.item.name}`);
        }
        // Clear screen and show new room description
        addToOutput(result.description, '', true);
        return;

      case 'inventory':
        if (gameState.inventory.length === 0) {
          addToOutput("Your inventory is empty.", input);
        } else {
          addToOutput("You are carrying:\n" + 
            gameState.inventory.map(item => `- ${item.name}`).join('\n'), input);
        }
        break;

      case 'save':
        try {
          saveGame(gameState);
          addToOutput("Game saved successfully.", input);
          addJournalEntry("Game saved");
        } catch (error) {
          addToOutput("Failed to save game.", input);
        }
        break;

      case 'load':
        try {
          const loadedState = loadGame();
          if (loadedState) {
            // Make sure all discovered rooms have their items initialized
            loadedState.dungeon.rooms.forEach(room => {
              if (room.discovered && (!room.items || room.items.length === 0)) {
                room.createItemsFromFeatures();
              }
            });
            
            setGameState(loadedState);
            const currentRoom = loadedState.dungeon.rooms.get(loadedState.dungeon.currentRoomId);
            addToOutput("Game loaded successfully.", input);
            addToOutput(currentRoom.getFullDescription());
            addJournalEntry("Game loaded");
          } else {
            addToOutput("No saved game found.", input);
          }
        } catch (error) {
          console.error('Error:', error);
          addToOutput("Failed to load game.", input);
        }
        break;

      case 'help':
        setIsHelpOpen(true);
        addToOutput("Showing help screen.", input);
        // Update stats for help achievement
        if (!gameState.stats.helpUsed) {
          updateStats({
            helpUsed: true
          });
        }
        break;

      case 'examine':
        console.log('Examine command initiated for:', target);
        
        if (!target) {
          addToOutput("What do you want to examine?");
          return;
        }

        if (target === 'puzzle' && currentRoom.puzzle) {
          const puzzleResult = currentRoom.examinePuzzle();
          addToOutput(puzzleResult.content);
          return;
        }

        const examineResult = currentRoom.examineItem(target);
        console.log('Examine result:', examineResult);

        addToOutput(examineResult.message);
        
        if (examineResult.fragments) {
          setGameState(prev => ({
            ...prev,
            memoryFragments: prev.memoryFragments + examineResult.fragments
          }));
          addToOutput(`You gain ${examineResult.fragments} memory fragments from the examination.`);
          addJournalEntry(`Found ${examineResult.fragments} fragments examining ${target}`);
        }
        return;

      case 'solve':
        if (target === 'puzzle') {
          if (!currentRoom.puzzle) {
            addToOutput("There's no puzzle to solve here.");
            return;
          }
          if (currentRoom.puzzle.solved) {
            addToOutput("You've already solved this puzzle.");
            return;
          }
          if (currentRoom.puzzle.destroyed) {
            addToOutput("This puzzle has been destroyed.");
            return;
          }
          
          const result = currentRoom.puzzle.checkSolution(answer, gameState.player);
          handlePuzzleSolve(currentRoom.puzzle, result);
          if (result.success) {
            soundManager.play('puzzle_solve');
            handleFragmentGain(result.reward);
            addToOutput([
              "That's correct!",
              `You earned ${result.reward} memory fragments.`
            ].join('\n'));
            setGameState(prev => ({
              ...prev,
              memoryFragments: (prev.memoryFragments || 0) + result.reward,
              player: { ...prev.player, health: prev.player.health }
            }));
          } else {
            // Handle failed attempt
            addToOutput(result.message);
            if (result.damage > 0) {
              addJournalEntry(`Took ${result.damage} damage from failed puzzle attempt`);
            }
            if (result.destroyed) {
              addJournalEntry('Puzzle was destroyed due to too many failed attempts');
            }
            setGameState(prev => ({
              ...prev,
              player: { ...prev.player, health: prev.player.health - result.damage }
            }));
            
            // Show hint after failure
            const hint = currentRoom.puzzle.getHint();
            if (hint) {
              addToOutput(`Hint: ${hint}`);
            }
          }
        }
        break;

      case 'achievements':
      case 'a':
        setIsAchievementsOpen(true);
        break;

      case 'use':
        const [itemName, withTarget] = target.split(' with ');
        const itemToUse = findItem(itemName, gameState.inventory);
        const targetItem = findItem(withTarget, currentRoom.items);
        
        if (!itemToUse) {
          addToOutput("You don't have that item.");
          return;
        }
        
        if (!targetItem) {
          addToOutput("You don't see that here to use the item with.");
          return;
        }
        
        if (itemToUse.useWith) {
          const result = itemToUse.useWith(targetItem);
          if (result.success) {
            addToOutput(result.message);
            result.effect();
            // Remove the token after use
            setGameState(prev => ({
              ...prev,
              inventory: prev.inventory.filter(item => item.id !== itemToUse.id)
            }));
          } else {
            addToOutput(result.message);
          }
        } else {
          addToOutput("That item can't be used with other items.");
        }
        break;

      case 'memories':
        if (gameState.stats?.deaths > 0) {
          setShowMemoriesUI(true);
          addToOutput("Opening memories interface... (Purchases only available after death)");
        } else {
          addToOutput("You don't have access to memories yet. Perhaps death will teach you...");
        }
        return;

      default:
        addToOutput("I don't understand that command.", input);
    }
  };

  const handlePurchaseUpgrade = async (category, upgrade) => {
    console.log('Attempting to purchase:', category, upgrade);
    const currentLevel = gameState.permanentUpgrades[category]?.[upgrade] || 0;
    const result = Memories.purchaseUpgrade(
        category,
        upgrade,
        currentLevel,
        gameState.memoryFragments
    );
    
    if (result) {
        console.log('Purchase successful:', result);
        soundManager.play('purchase');
        
        // Apply starter equipment effects immediately
        if (category === 'starter') {
            const effect = Memories.categories.starter.upgrades[upgrade].effect();
            setGameState(prev => ({
                ...prev,
                memoryFragments: result.remainingFragments,
                permanentUpgrades: {
                    ...prev.permanentUpgrades,
                    [category]: {
                        ...prev.permanentUpgrades?.[category],
                        [upgrade]: result.newLevel
                    }
                },
                player: {
                    ...prev.player,
                    attack: prev.player.attack + (effect.attackBonus || 0),
                    defense: prev.player.defense + (effect.defenseBonus || 0),
                    healAfterCombat: (prev.player.healAfterCombat || 0) + (effect.healAfterCombat || 0)
                }
            }));
        } else {
            // Handle normal upgrades as before
            setGameState(prev => ({
                ...prev,
                memoryFragments: result.remainingFragments,
                permanentUpgrades: {
                    ...prev.permanentUpgrades,
                    [category]: {
                        ...prev.permanentUpgrades?.[category],
                        [upgrade]: result.newLevel
                    }
                }
            }));
        }
        
        addJournalEntry(`Upgraded ${category} - ${upgrade} to level ${result.newLevel}`);
        return result;
    } else {
        console.log('Purchase failed');
        soundManager.play('error');
        return null;
    }
  };

  // Add method to set puzzle active
  const setPuzzleActive = (puzzle) => {
    setActivePuzzle(puzzle);
  };

  // Add trap handling methods
  const handleExamineTrap = (room) => {
    if (room.trap && !room.trap.isDisarmed) {
      setActiveTrap(room.trap);
    }
  };

  const handleTrapDisarm = (method, input) => {
    if (!currentRoom || !activeTrap) return;

    const result = currentRoom.attemptDisarmTrap(method, input, player);
    
    if (result.success) {
      addToGameLog(result.message);
      if (result.fragments) {
        setMemoryFragments(prev => prev + result.fragments);
        addToGameLog(`You gained ${result.fragments} memory fragments!`);
      }
      setActiveTrap(null);
    } else {
      addToGameLog(result.message);
      if (result.damage) {
        addToGameLog(`You took ${result.damage} damage!`);
      }
      if (result.destroyed) {
        setActiveTrap(null);
      }
    }
  };

  // Add effect to handle focus after state changes
  useEffect(() => {
    if (!isCombatOpen && !activePuzzle && !activeTrap) {
      refocusCommandPrompt();
    }
  }, [isCombatOpen, activePuzzle, activeTrap]);

  return (
    <>
      {showSplash ? (
        <SplashScreen
          onNewGame={initializeGame}
          onLoadGame={handleLoadGame}
          onShowAchievements={() => setIsAchievementsOpen(true)}
          hasSavedGame={hasSavedGame()}
        />
      ) : (
        <div className="game-container">
          <div className="game-left">
            <ImageDisplay currentRoom={gameState.currentRoom} />
            <GameOutput messages={gameState.gameOutput} />
            <CommandPrompt 
              ref={commandPromptRef}
              onCommand={handleCommand} 
            />
          </div>
          <div className="game-center">
            <PlayerStats 
              player={gameState.player} 
              statsRevealed={gameState.statsRevealed}
              memoryFragments={gameState.memoryFragments}
              unlockedStats={gameState.unlockedStats}
              onPurchase={handleStatUnlock}
            />
            <DungeonMap dungeon={gameState.dungeon} playerPosition={gameState.playerPosition} />
          </div>
          <div className="game-right">
            <Inventory items={gameState.inventory} />
            <Journal entries={gameState.journalEntries} />
          </div>
          <Help isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
          <Combat 
            isOpen={isCombatOpen} 
            onClose={() => {
              setIsCombatOpen(false);
              refocusCommandPrompt();
            }}
            player={gameState.player}
            enemy={currentEnemy}
            onCombatEnd={handleCombatEnd}
            currentRoom={gameState.currentRoom}
          />
          <DebugMenu
            isOpen={showDebugMenu}
            onClose={() => setShowDebugMenu(false)}
            player={gameState.player}
            setPlayer={(player) => setGameState(prev => ({ ...prev, player }))}
            dungeon={gameState.dungeon}
            setDungeon={(dungeon) => setGameState(prev => ({ ...prev, dungeon }))}
            memoryFragments={gameState.memoryFragments}
            setMemoryFragments={(fragments) => setGameState(prev => ({ ...prev, memoryFragments: fragments }))}
            discoveredTreasures={gameState.discoveredTreasures || new Set()}
            setDiscoveredTreasures={(treasures) => setGameState(prev => ({ ...prev, discoveredTreasures: treasures }))}
            initializeGame={initializeGame}
            handlePlayerDeath={handlePlayerDeath}
          />
          <AchievementUI 
            isOpen={isAchievementsOpen}
            onClose={() => setIsAchievementsOpen(false)}
            stats={gameState.stats}
            unlockedAchievements={gameState.unlockedAchievements}
          />
          <AchievementNotification 
            achievement={achievementNotification}
            onDismiss={() => setAchievementNotification(null)}
          />
          {activePuzzle && (
            <PuzzleUI 
              puzzle={activePuzzle}
              onClose={() => {
                setActivePuzzle(null);
                refocusCommandPrompt();
              }}
              onComplete={(fragments) => {
                setMemoryFragments(prev => prev + fragments);
                setActivePuzzle(null);
              }}
            />
          )}
          <MemoriesUI 
            isOpen={showMemoriesUI}
            onClose={() => {
                setShowMemoriesUI(false);
                if (gameState.isDead) {
                    handleContinue();
                }
            }}
            currentMemories={gameState.memoryFragments}
            permanentUpgrades={gameState.permanentUpgrades}
            memoryFragments={gameState.memoryFragments}
            onPurchaseUpgrade={handlePurchaseUpgrade}
            allowPurchases={gameState.isDead}
          />
          {activeTrap && (
            <TrapUI
              trap={activeTrap}
              onAttemptDisarm={handleTrapDisarm}
              onClose={() => {
                setActiveTrap(null);
                refocusCommandPrompt();
              }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;