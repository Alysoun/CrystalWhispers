import { Dungeon } from '../game/DungeonGenerator';
import { Player } from '../game/Player';
import { Memories } from '../game/Memories';
import { TimeRiddle } from '../game/puzzles/TimeRiddle';

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

  test('Trap Room Generation and Interaction', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const player = new Player();
    
    // Find a trap room
    const trapRoom = Array.from(dungeon.rooms.values())
      .find(room => room.roomType === 'trap');
    
    if (trapRoom) {
      expect(trapRoom.trap).toBeDefined();
      expect(trapRoom.trap.trapType).toBeDefined();
      
      // Test trap disarm attempt
      const result = trapRoom.attemptDisarmTrap('TIMING', null, player);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      
      if (!result.success) {
        // Verify trap effect was applied
        expect(player.health).toBeLessThan(player.maxHealth);
      }
    }
  });

  test('Time Riddle Puzzle Mechanics', () => {
    const puzzle = new TimeRiddle();
    expect(puzzle.sequence).toBeDefined();
    expect(puzzle.solution).toBeDefined();
    
    // Test incorrect solution
    const wrongResult = puzzle.validateSolution('wrong answer');
    expect(wrongResult).toBe(false);
    
    // Test correct solution
    const correctResult = puzzle.validateSolution(puzzle.solution);
    expect(correctResult).toBe(true);
  });
}); 