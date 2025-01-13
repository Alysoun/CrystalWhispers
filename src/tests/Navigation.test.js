import { Dungeon } from './mocks/Dungeon';
import { Player } from './mocks/Player';

describe('Navigation System', () => {
  test('Room Movement', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const player = new Player();
    const startRoom = dungeon.rooms.get(0);
    
    // Get first available connection
    const [nextRoomId, connection] = Array.from(startRoom.connections.entries())[0];
    
    expect(startRoom.discovered).toBe(true);
    expect(connection.room.discovered).toBe(false);
    
    // Move to next room
    const moveResult = dungeon.movePlayer(0, nextRoomId);
    expect(moveResult.success).toBe(true);
    expect(moveResult.newRoom.discovered).toBe(true);
  });

  test('Room Discovery', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const startRoom = dungeon.rooms.get(0);
    
    // Check initial state
    expect(startRoom.discovered).toBe(true);
    expect(dungeon.rooms.get(1).discovered).toBe(false);
    
    // Move and check discovery
    dungeon.movePlayer(0, 1);
    expect(dungeon.rooms.get(1).discovered).toBe(true);
  });

  test('Invalid Movement', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const moveResult = dungeon.movePlayer(0, 999); // Invalid room ID
    expect(moveResult.success).toBe(false);
  });
}); 