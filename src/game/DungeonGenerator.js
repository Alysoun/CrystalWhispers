import { Room } from './rooms/Room';
import { getRandomInt } from '../utils/helpers';
import { getBossForLevel } from './bosses/GriefBosses';
import { FloorTheme } from './themes/FloorTheme';
import seedrandom from 'seedrandom';

class Dungeon {
  constructor(width, height, numRooms, level = 1, seed = null) {
    this.width = width;
    this.height = height;
    this.numRooms = numRooms;
    this.level = level;
    this.seed = seed || Math.random().toString(36).substring(7);
    this.rng = seedrandom(this.seed);
    this.rooms = new Map();
    this.currentRoomId = 0;
    this.nextRoomId = 0;
    this.theme = new FloorTheme(level);
    this.generateDungeon();
  }

  random() {
    return this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  generateTheme() {
    return new FloorTheme(this.level);
  }

  generateDungeon() {
    // Create the starting room in the center
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    const ROOM_SIZE = 5;
    
    const startRoom = new Room(
      this.getNextRoomId(), 
      centerX, 
      centerY, 
      ROOM_SIZE, 
      ROOM_SIZE, 
      this.theme,
      this
    );
    
    this.rooms.set(startRoom.id, startRoom);
    startRoom.generateContent();  // Generate content for starting room

    // Generate additional rooms
    for (let i = 1; i < this.numRooms; i++) {
      this.addAdjacentRoom(ROOM_SIZE);
    }

    // Add extra connections for variety
    this.connectRooms();
    this.addExtraConnections();

    // Generate content for all rooms after they're connected
    this.rooms.forEach(room => {
      if (!room.contentGenerated) {
        room.generateContent();
      }
    });

    // Ensure boss room exists
    const bossRooms = Array.from(this.rooms.values()).filter(r => r.roomType === 'boss');
    if (bossRooms.length === 0) {
      // Find the room furthest from start to make it the boss room
      const startRoom = this.rooms.get(0);
      let furthestRoom = null;
      let maxDistance = 0;
      
      this.rooms.forEach(room => {
        const distance = Math.abs(room.x - startRoom.x) + Math.abs(room.y - startRoom.y);
        if (distance > maxDistance && room.id !== 0) {
          maxDistance = distance;
          furthestRoom = room;
        }
      });
      
      if (furthestRoom) {
        furthestRoom.roomType = 'boss';
        furthestRoom.generateContent();
      }
    }
  }

  getNextRoomId() {
    return this.nextRoomId++;
  }

  addAdjacentRoom(roomSize) {
    // Pick a random existing room to branch from
    const existingRooms = Array.from(this.rooms.values());
    const parentRoom = existingRooms[Math.floor(this.random() * existingRooms.length)];  // Use seeded RNG
    const newRoomId = this.getNextRoomId();

    // Room spacing should be roomSize + 1 for corridors
    const ROOM_SPACING = roomSize + 2;
    
    const directions = [
      { dx: 1, dy: 0, dir: 'east' },
      { dx: -1, dy: 0, dir: 'west' },
      { dx: 0, dy: 1, dir: 'south' },
      { dx: 0, dy: -1, dir: 'north' }
    ].sort(() => Math.random() - 0.5);

    for (const { dx, dy, dir } of directions) {
      const newX = parentRoom.x + (dx * ROOM_SPACING);
      const newY = parentRoom.y + (dy * ROOM_SPACING);

      if (this.isValidPosition(newX, newY, roomSize) && !this.hasOverlap(newX, newY, roomSize)) {
        const newRoom = new Room(
          newRoomId, 
          newX, 
          newY, 
          roomSize, 
          roomSize, 
          this.theme,
          this
        );
        this.rooms.set(newRoomId, newRoom);
        
        // Create bidirectional connections
        const oppositeDir = this.getOppositeDirection(dir);
        parentRoom.connectTo(newRoom, dir);
        newRoom.connectTo(parentRoom, oppositeDir);
        return;
      }
    }

    // If we couldn't place the room, try again with a different parent
    if (existingRooms.length > 1) {
      this.addAdjacentRoom(roomSize);
    }
  }

  getOppositeDirection(dir) {
    const opposites = {
      'north': 'south',
      'south': 'north',
      'east': 'west',
      'west': 'east'
    };
    return opposites[dir];
  }

  hasOverlap(x, y, size) {
    const BUFFER = 2; // Increased buffer between rooms
    return Array.from(this.rooms.values()).some(room => {
      return !(x + size + BUFFER <= room.x || 
               x >= room.x + room.width + BUFFER ||
               y + size + BUFFER <= room.y || 
               y >= room.y + room.height + BUFFER);
    });
  }

  isValidPosition(x, y, size) {
    return x >= 0 && x + size <= this.width && y >= 0 && y + size <= this.height;
  }

  connectRooms() {
    const unconnected = new Set(this.rooms.keys());
    const connected = new Set([0]);
    unconnected.delete(0);

    while (unconnected.size > 0) {
      let minDistance = Infinity;
      let bestPair = null;
      let bestDirection = null;

      for (let connectedId of connected) {
        for (let unconnectedId of unconnected) {
          const distance = this.getRoomDistance(
            this.rooms.get(connectedId),
            this.rooms.get(unconnectedId)
          );
          if (distance < minDistance) {
            minDistance = distance;
            bestPair = [connectedId, unconnectedId];
            bestDirection = this.getDirection(
              this.rooms.get(connectedId),
              this.rooms.get(unconnectedId)
            );
          }
        }
      }

      if (bestPair && bestDirection) {
        const [roomAId, roomBId] = bestPair;
        const roomA = this.rooms.get(roomAId);
        const roomB = this.rooms.get(roomBId);
        // Add bidirectional connections
        roomA.connectTo(roomB, bestDirection);
        roomB.connectTo(roomA, this.getOppositeDirection(bestDirection));
        connected.add(roomBId);
        unconnected.delete(roomBId);
      }
    }
  }

  getRoomDistance(roomA, roomB) {
    const centerA = roomA.getCenter();
    const centerB = roomB.getCenter();
    return Math.abs(centerA.x - centerB.x) + Math.abs(centerA.y - centerB.y);
  }

  getDirection(roomA, roomB) {
    const centerA = roomA.getCenter();
    const centerB = roomB.getCenter();
    
    const dx = centerB.x - centerA.x;
    const dy = centerB.y - centerA.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'east' : 'west';
    } else {
      return dy > 0 ? 'south' : 'north';
    }
  }

  addExtraConnections() {
    const EXTRA_CONNECTIONS = 3;
    const roomIds = Array.from(this.rooms.keys());
    
    for (let i = 0; i < EXTRA_CONNECTIONS; i++) {
      const roomAId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const roomBId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const roomA = this.rooms.get(roomAId);
      const roomB = this.rooms.get(roomBId);
      
      if (roomAId !== roomBId && !roomA.connections.has(roomBId)) {
        const direction = this.getDirection(roomA, roomB);
        // Add bidirectional connections
        roomA.connectTo(roomB, direction);
        roomB.connectTo(roomA, this.getOppositeDirection(direction));
      }
    }
  }

  getCurrentRoom() {
    return this.rooms.get(this.currentRoomId);
  }

  isConsistentWithConnections(x, y, direction) {
    // Check if the new position makes sense with existing connections
    return true; // Implement proper validation
  }
}

export { Dungeon }; 