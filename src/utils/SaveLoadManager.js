import { Dungeon, Room } from '../game/DungeonGenerator';

const SAVE_KEY = 'crystal_whispers_save';

export const loadGame = () => {
  try {
    const savedState = JSON.parse(localStorage.getItem('gameState'));
    if (!savedState) return null;

    // Create a complete new dungeon first
    const dungeon = new Dungeon(
      savedState.dungeon.width, 
      savedState.dungeon.height, 
      15, 
      savedState.dungeon.level
    );
    
    // Store the complete map of rooms
    const completeRooms = new Map(dungeon.rooms);

    // Clear rooms to prepare for saved state reconstruction
    dungeon.rooms = new Map();
    dungeon.currentRoomId = savedState.dungeon.currentRoomId;

    // First pass: Create all saved rooms, using complete room data where available
    Object.entries(savedState.dungeon.rooms).forEach(([id, roomData]) => {
      const completeRoom = completeRooms.get(parseInt(id));
      const room = new Room(
        parseInt(id),
        roomData.x || completeRoom.x,
        roomData.y || completeRoom.y,
        roomData.width || completeRoom.width,
        roomData.height || completeRoom.height,
        dungeon.theme
      );
      
      // Merge saved state with complete room data
      room.discovered = roomData.discovered;
      room.items = roomData.items || [];
      room.features = roomData.features || completeRoom.features;
      room.description = roomData.description || completeRoom.description;
      dungeon.rooms.set(parseInt(id), room);
    });

    // Add any rooms from complete map that weren't in saved state
    completeRooms.forEach((room, id) => {
      if (!dungeon.rooms.has(id)) {
        dungeon.rooms.set(id, room);
      }
    });

    // Second pass: Reconstruct connections between rooms
    Object.entries(savedState.dungeon.rooms).forEach(([id, roomData]) => {
      const room = dungeon.rooms.get(parseInt(id));
      room.connections = new Map();
      
      if (roomData.connections) {
        Object.entries(roomData.connections).forEach(([connId, connData]) => {
          const connectedRoom = dungeon.rooms.get(parseInt(connId));
          if (connectedRoom) {
            room.connections.set(parseInt(connId), {
              room: connectedRoom,
              direction: connData.direction,
              state: connData.state
            });
          }
        });
      }
    });

    // Restore connections for rooms that weren't in saved state
    completeRooms.forEach((completeRoom, id) => {
      const room = dungeon.rooms.get(id);
      if (!room.connections || room.connections.size === 0) {
        room.connections = completeRoom.connections;
      }
    });

    return {
      ...savedState,
      dungeon,
      currentRoom: dungeon.rooms.get(dungeon.currentRoomId)
    };
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
};

export const saveGame = (gameState) => {
  try {
    // Convert Maps to serializable objects
    const serializedRooms = {};
    gameState.dungeon.rooms.forEach((room, id) => {
      const serializedConnections = {};
      room.connections.forEach((conn, connId) => {
        serializedConnections[connId] = {
          direction: conn.direction,
          state: conn.state
        };
      });

      serializedRooms[id] = {
        ...room,
        connections: serializedConnections
      };
    });

    const serializedDungeon = {
      ...gameState.dungeon,
      rooms: serializedRooms
    };

    const stateToSave = {
      ...gameState,
      dungeon: serializedDungeon
    };

    localStorage.setItem('gameState', JSON.stringify(stateToSave));
    return true;
  } catch (error) {
    console.error('Error saving game:', error);
    return false;
  }
};

export const hasSavedGame = () => {
  return localStorage.getItem('gameState') !== null;
}; 