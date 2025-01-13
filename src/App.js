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
import SplashScreen from './components/SplashScreen/SplashScreen';
import { Story } from './game/Story';
import PuzzleUI from './components/PuzzleUI/PuzzleUI';
import MemoriesUI from './components/MemoriesUI/MemoriesUI';
import { Memories } from './game/Memories';
import { soundManager } from './utils/SoundManager';

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
    const loadedState = loadGame();
    if (loadedState) {
      setGameState(loadedState);
      setShowSplash(false);
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
    console.log('Combat ended with result:', result);
    setIsCombatOpen(false);
    setCurrentEnemy(null);
    
    // Update room state after combat
    const currentRoom = gameState.currentRoom;
    currentRoom.handleCombatEnd(result);
    
    if (result.victory) {
      const expGained = currentEnemy.experience;
      console.log('Experience to gain:', expGained);
      console.log('Current player before exp:', gameState.player);
      
      // Update player state with experience
      setGameState(prev => {
        const player = prev.player;
        const oldLevel = player.level;
        console.log('Old level:', oldLevel);
        player.gainExperience(expGained);
        console.log('Player after gainExperience:', player);
        
        return {
          ...prev,
          player: player,
          stats: {
            ...prev.stats,
            combatsWon: prev.stats.combatsWon + 1
          }
        };
      });
      
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

      // Update stats
      setGameState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          combatsWon: prev.stats.combatsWon + 1
        }
      }));
    } else if (result.fled) {
      addToOutput("You managed to escape!", "flee");
    } else if (gameState.player.health <= 0) {
      // Handle death
      setShowMemoriesUI(true);
      Memories.unlockMemories();
      addToOutput("You have fallen...", "death");
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
    // Calculate memories to keep (20% of current)
    const memoriesToKeep = Math.floor(gameState.memoryFragments * 0.2);
    
    // Save permanent upgrades and kept memories
    setGameState(prev => ({
      ...prev,
      memoryFragments: memoriesToKeep,
      permanentUpgrades: prev.permanentUpgrades || {},
      isDead: true
    }));
    
    addToOutput([
      "Everything fades to darkness...",
      "But your memories remain, albeit fragmented...",
      `(Kept ${memoriesToKeep} memory fragments)`,
      "\nType 'continue' to return to the Memory Nexus"
    ].join('\n'));
    
    // Show the MemoriesUI
    setShowMemoriesUI(true);
  };

  const handleCommand = async (input) => {
    // Add new command for continuing after death
    if (gameState.isDead && input.toLowerCase() === 'continue') {
      setShowMemoriesUI(true);
      return;
    }

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
        const item = currentRoom.items.find(i => 
          i.name === target || 
          (i.aliases && i.aliases.includes(target))
        );
        
        if (item) {
          console.log('Found item:', item);
          const result = currentRoom.removeItem(item);
          console.log('Remove result:', result);
          if (result.success) {
            addToOutput(result.message, input);
            // Create new room while preserving prototype methods
            const updatedRoom = Object.assign(
              Object.create(Object.getPrototypeOf(currentRoom)),
              currentRoom,
              {
                items: [...currentRoom.items],
                description: currentRoom.description,
                roomFeatures: [...currentRoom.roomFeatures]
              }
            );
            console.log('Updated room items:', updatedRoom.items);
            
            // Add updated room description after item is taken
            addToOutput(updatedRoom.getFullDescription(), null, true);
            
            if (result.fragments) {
              setGameState(prev => ({
                ...prev,
                memoryFragments: prev.memoryFragments + result.fragments,
                dungeon: {
                  ...prev.dungeon,
                  currentRoom: updatedRoom,
                  rooms: new Map(prev.dungeon.rooms).set(currentRoom.id, updatedRoom)
                }
              }));
              addJournalEntry(`Acquired ${item.name} (+${result.fragments} fragments)`);
              console.log('GameState updated with fragments');
            } else {
              setGameState(prev => ({
                ...prev,
                dungeon: {
                  ...prev.dungeon,
                  currentRoom: updatedRoom,
                  rooms: new Map(prev.dungeon.rooms).set(currentRoom.id, updatedRoom)
                }
              }));
              addJournalEntry(`Removed ${item.name}`);
              console.log('GameState updated without fragments');
            }
          }
        }
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
        if (target === 'puzzle' && currentRoom.puzzle) {
          if (currentRoom.puzzle.destroyed) {
            addToOutput("The puzzle lies in ruins, beyond any hope of solving.");
          } else if (currentRoom.puzzle.solved) {
            addToOutput("You've already solved this puzzle.");
          } else {
            setActivePuzzle(currentRoom.puzzle);
            addToOutput("You begin examining the puzzle...");
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

      default:
        addToOutput("I don't understand that command.", input);
    }
  };

  const handlePurchaseUpgrade = (category, upgrade) => {
    const currentLevel = permanentUpgrades[category]?.[upgrade] || 0;
    const result = Memories.purchaseUpgrade(
      category,
      upgrade,
      currentLevel,
      gameState.memoryFragments
    );
    
    if (result) {
      soundManager.play('purchase');
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
      
      addJournalEntry(`Upgraded ${category} - ${upgrade} to level ${result.newLevel}`);
    } else {
      soundManager.play('error');
    }
  };

  // Add method to set puzzle active
  const setPuzzleActive = (puzzle) => {
    setActivePuzzle(puzzle);
  };

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
            discoveredTreasures={new Set()}
            setDiscoveredTreasures={(discoveredTreasures) => setGameState(prev => ({ ...prev, discoveredTreasures }))}
            initializeGame={initializeGame}
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
              onClose={() => setActivePuzzle(null)}
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
                // Reset the game but keep permanent upgrades
                initializeGame(permanentUpgrades);
              }
            }}
            currentMemories={[]}
            permanentUpgrades={gameState.permanentUpgrades}
            memoryFragments={gameState.memoryFragments}
            onPurchaseUpgrade={(category, upgrade) => {
              const result = Memories.purchaseUpgrade(
                category, 
                upgrade, 
                gameState.permanentUpgrades[category]?.[upgrade] || 0,
                gameState.memoryFragments
              );
              if (result) {
                setGameState(prev => ({
                  ...prev,
                  memoryFragments: result.remainingFragments,
                  permanentUpgrades: {
                    ...prev.permanentUpgrades,
                    [category]: {
                      ...(prev.permanentUpgrades[category] || {}),
                      [upgrade]: result.newLevel
                    }
                  }
                }));
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default App;