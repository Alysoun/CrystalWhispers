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
    dungeon: null
  });

  // Add state for help modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

  const addJournalEntry = (text) => {
    const timestamp = new Date().toLocaleTimeString();
    setGameState(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, { timestamp, text }]
    }));
  };

  const addToOutput = (message, userInput = '') => {
    setGameState(prev => {
      const currentMessages = prev.gameOutput || [];
      const newMessages = userInput 
        ? [...currentMessages, `> ${userInput}`, message]
        : [...currentMessages, message];
      return {
        ...prev,
        gameOutput: newMessages.slice(-MAX_MESSAGES)
      };
    });
  };

  const handleCommand = (input) => {
    const { command, target } = parseCommand(input);
    const commandType = getCommandType(command);

    // Add check for dungeon existence
    if (!gameState.dungeon && commandType !== 'load' && commandType !== 'help') {
      addToOutput("You need to start or load a game first.", input);
      return;
    }

    if (!commandType) {
      addToOutput("I don't understand that command.", input);
      return;
    }

    switch (commandType) {
        case 'go':
            const direction = target;
            const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
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
              nextRoom.discover();
          
              if (!nextRoom.items || nextRoom.items.length === 0) {
                nextRoom.createItemsFromFeatures();
              }
          
              // Update gameState with the new room and player position
              setGameState(prev => {
                const updatedDungeon = prev.dungeon;
                updatedDungeon.currentRoomId = nextRoomId;
                
                return {
                  ...prev,
                  dungeon: updatedDungeon,
                  currentRoom: nextRoom,
                  playerPosition: { x: nextRoom.x, y: nextRoom.y },
                };
              });
          
              addToOutput(nextRoom.getFullDescription(), input);
              addJournalEntry(`Moved ${direction} to room ${nextRoomId}`);
            } else {
              if (direction) {
                addToOutput(`You cannot go ${direction} from here.`, input);
              } else {
                addToOutput("Go where?", input);
              }
            }
            break;
          

      case 'look':
        if (!target) {
          addToOutput(gameState.currentRoom.getFullDescription(), input);
        } else {
          const item = findItem(target, gameState.currentRoom.items);
          if (item) {
            addToOutput(item.description, input);
          } else {
            addToOutput("You don't see that here.", input);
          }
        }
        break;

      case 'take':
        const itemToTake = findItem(target, gameState.currentRoom.items);
        
        if (itemToTake && itemToTake.canTake) {
          // Get the current room directly from the rooms Map
          const currentRoom = gameState.dungeon.rooms.get(gameState.dungeon.currentRoomId);
          
          // Update the room's items directly
          currentRoom.items = currentRoom.items.filter(i => i !== itemToTake);
          
          setGameState(prev => ({
            ...prev,
            inventory: [...prev.inventory, itemToTake]
          }));
          
          addToOutput(`You take the ${itemToTake.name}.`, input);
          if (itemToTake.important) {
            addJournalEntry(`Found ${itemToTake.name}`);
          }
        } else {
          addToOutput(itemToTake ? "You can't take that." : "You don't see that here.", input);
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
      <div className="game-right">
        <DungeonMap dungeon={gameState.dungeon} playerPosition={gameState.playerPosition} />
        <Inventory items={gameState.inventory} />
        <Journal entries={gameState.journalEntries} />
      </div>
      <Help isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;