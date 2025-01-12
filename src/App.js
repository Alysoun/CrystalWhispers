import React, { useState, useEffect } from 'react';
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

function App() {
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    playerPosition: { x: 0, y: 0 },
    inventory: [],
    currentRoom: null,
    gameOutput: ['Welcome to Crystal Whispers!', 'Type "help" for commands.'],
    map: [],
    currentImage: null,
    journalEntries: [],
    dungeon: null,
    player: new Player(),
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
      level: false,        // Unlocked after Mirror Keeper
      experience: false,   // Purchasable
      attack: false,      // Purchasable
      defense: false      // Purchasable
    },
    memoryFragments: 0
  });

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

  useEffect(() => {
    // Initialize game state
    const initializeGame = () => {
      const minRooms = 15;
      const maxRooms = 30;
      const numRooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
      const dungeon = new Dungeon(50, 50, numRooms);
      const startingRoom = dungeon.rooms.get(0);
      startingRoom.discovered = true;
      startingRoom.createItemsFromFeatures();
      
      // Mark the starting room's exits as known
      startingRoom.connections.forEach(({ room: connectedRoom }) => {
        connectedRoom.knownExit = true;
      });

      if (hasSavedGame()) {
        setGameState(prev => ({
          ...prev,
          dungeon,
          currentRoom: startingRoom,
          gameOutput: ['Welcome to the Roguelike Adventure!', 
                      'Type "help" for commands.',
                      'Found a saved game. Type "load" to restore it.']
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          dungeon,
          currentRoom: startingRoom
        }));
      }
    };

    initializeGame();
  }, []);

  // Add effect for keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setShowDebugMenu(prev => !prev);
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

  const addToOutput = (message, command, clearScreen = false) => {
    setGameState(prev => ({
      ...prev,
      gameOutput: clearScreen ? [message] : [...prev.gameOutput, message]
    }));
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
    setIsCombatOpen(false);
    
    if (result === 'victory') {
      const expGained = currentEnemy.experience;
      const oldLevel = gameState.player.level;
      
      // Add experience and check if leveled up
      gameState.player.gainExperience(expGained);
      
      // Clear screen and show only combat results
      addToOutput([
        `You defeated the ${currentEnemy.name}!`,
        `Experience gained: ${expGained}`,
        gameState.player.level > oldLevel ? 
          `Level Up! You are now level ${gameState.player.level}!` : '',
        '',
        'Type "look" to examine your surroundings.'
      ].filter(line => line !== '').join('\n'), null, true);

      addJournalEntry(`Defeated ${currentEnemy.name} (+${expGained} exp)`);
      
      if (currentEnemy.name === 'Mirror Keeper') {
        setGameState(prev => ({
          ...prev,
          statsRevealed: true
        }));
        addToOutput([
          `You defeated the ${currentEnemy.name}!`,
          'As the mirror shatters, you begin to see yourself more clearly...',
          'Your understanding of your own capabilities has deepened.',
          `Experience gained: ${currentEnemy.experience}`,
        ].join('\n'), null, true);
      }
    } else if (result === 'defeat') {
      addToOutput([
        'You have been defeated...',
        'Game Over'
      ].join('\n'), null, true);
      addJournalEntry('Defeated in combat');
      // Handle player death here - maybe add restart/reload functionality
    } else if (result === 'flee') {
      addToOutput([
        'You fled from combat!',
        '',
        'Type "look" to examine your surroundings.'
      ].join('\n'), null, true);
      addJournalEntry('Fled from combat');
    }
    
    setCurrentEnemy(null);
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

  const handleCommand = (input) => {
    const { command, target, answer } = parseCommand(input);
    const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);

    switch (command) {
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
          handleRoomDiscovery(nextRoom);
          nextRoom.discover();
      
          if (!nextRoom.items || nextRoom.items.length === 0) {
            nextRoom.createItemsFromFeatures();
          }
      
          // Check for combat
          if (nextRoom.roomType === 'combat' && nextRoom.enemyType) {
            setCurrentEnemy(nextRoom.enemyType);
            setIsCombatOpen(true);
            addToOutput(`A ${nextRoom.enemyType.name} appears!`, input);
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
        const itemToTake = findItem(target, currentRoom.items);
        if (itemToTake) {
          setGameState(prev => ({
            ...prev,
            inventory: [...prev.inventory, itemToTake]
          }));
          currentRoom.removeItem(itemToTake);
          addToOutput(`You take the ${itemToTake.name}.`);
          addJournalEntry(`Acquired ${itemToTake.name}`);
          if (itemToTake.isTreasure) {
            handleTreasureFound(itemToTake);
          }
        } else {
          addToOutput("You don't see that here.");
        }
        break;

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
        break;

      case 'examine':
        if (target === 'puzzle' && currentRoom.puzzle) {
          if (currentRoom.puzzle.destroyed) {
            addToOutput("The puzzle lies in ruins, beyond any hope of solving.");
          } else if (currentRoom.puzzle.solved) {
            addToOutput("You've already solved this puzzle.");
          } else {
            addToOutput(currentRoom.puzzle.getDescription());
          }
        } else {
          addToOutput("There's nothing like that to examine here.");
        }
        break;

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

      default:
        addToOutput("I don't understand that command.", input);
    }
  };

  return (
    <div className="game-container">
      <div className="game-left">
        <ImageDisplay currentImage={gameState.currentImage} />
        <GameOutput messages={gameState.gameOutput} />
        <CommandPrompt onCommand={handleCommand} />
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
        onClose={() => setIsCombatOpen(false)}
        player={gameState.player}
        enemy={currentEnemy}
        onCombatEnd={handleCombatEnd}
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
        discoveredTreasures={new Set()}
        setDiscoveredTreasures={(discoveredTreasures) => setGameState(prev => ({ ...prev, discoveredTreasures }))}
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
    </div>
  );
}

export default App;