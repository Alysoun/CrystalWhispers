import { Dungeon } from '../game/DungeonGenerator';
import { Player } from '../game/Player';
import { Memories } from '../game/Memories';

describe('Core Game Functionality', () => {
  let dungeon;
  let player;

  beforeEach(() => {
    dungeon = new Dungeon(50, 50, 20); // Standard size dungeon
    player = new Player();
  });

  test('Dungeon Generation', () => {
    expect(dungeon.rooms.size).toBeGreaterThanOrEqual(15);
    expect(dungeon.rooms.size).toBeLessThanOrEqual(30);
    
    // Check room connections
    const startRoom = dungeon.rooms.get(0);
    expect(startRoom.connections.size).toBeGreaterThan(0);
    
    // Verify room types distribution
    const roomTypes = Array.from(dungeon.rooms.values()).map(r => r.roomType);
    expect(roomTypes.filter(t => t === 'combat').length).toBeGreaterThanOrEqual(6);
    expect(roomTypes.filter(t => t === 'puzzle').length).toBeGreaterThanOrEqual(2);
    expect(roomTypes.filter(t => t === 'treasure').length).toBeGreaterThanOrEqual(1);
  });

  test('Player Movement and Room Discovery', () => {
    const startRoom = dungeon.rooms.get(0);
    expect(startRoom.discovered).toBe(true);
    
    // Test movement to connected room
    const connection = Array.from(startRoom.connections.values())[0];
    const moveResult = player.move(connection.direction, startRoom, dungeon);
    expect(moveResult.success).toBe(true);
    expect(moveResult.newRoom.discovered).toBe(true);
  });
}); 