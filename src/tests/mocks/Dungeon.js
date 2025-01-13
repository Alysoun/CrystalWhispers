export class Dungeon {
  constructor(width, height, numRooms, floor = 1) {
    this.roomsMap = new Map();
    this.currentRoomId = 0;
    
    // Create start room
    const startRoom = {
      id: 0,
      discovered: true,
      connections: new Map(),
      items: []
    };

    // Create connected room
    const nextRoom = {
      id: 1,
      discovered: false,
      connections: new Map(),
      items: []
    };

    // Set up connections
    startRoom.connections.set(1, {
      room: nextRoom,
      direction: 'east',
      state: 'open'
    });

    nextRoom.connections.set(0, {
      room: startRoom,
      direction: 'west',
      state: 'open'
    });

    this.roomsMap.set(0, startRoom);
    this.roomsMap.set(1, nextRoom);

    // Add boss room
    const bossRoom = {
      id: numRooms - 1,
      roomType: 'boss',
      enemyType: {
        level: floor,
        health: 100 * floor,
        attack: 10 * floor
      }
    };
    this.roomsMap.set(bossRoom.id, bossRoom);

    // Add exit room
    const exitRoom = {
      id: numRooms,
      roomType: 'exit',
      nextFloor: floor + 1
    };
    this.roomsMap.set(exitRoom.id, exitRoom);
  }

  // Support both Map and Array methods
  get rooms() {
    return {
      get: (id) => this.roomsMap.get(id),
      some: (fn) => Array.from(this.roomsMap.values()).some(fn),
      values: () => this.roomsMap.values(),
      set: (id, room) => this.roomsMap.set(id, room)
    };
  }

  movePlayer(fromRoomId, toRoomId) {
    const targetRoom = this.roomsMap.get(toRoomId);
    if (targetRoom) {
      targetRoom.discovered = true;
      this.currentRoomId = toRoomId;
      return {
        success: true,
        newRoom: targetRoom
      };
    }
    return { success: false };
  }
} 