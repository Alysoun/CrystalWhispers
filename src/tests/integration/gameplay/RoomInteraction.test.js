import { Dungeon } from '../../../game/DungeonGenerator';
import { Player } from '../../../mocks/Player';

describe('Room Interaction Flow', () => {
  test('Complete Room Interaction Cycle', () => {
    const dungeon = new Dungeon(50, 50, 20);
    const player = new Player();
    const room = dungeon.rooms.get(0);
    
    // Room discovery
    expect(room.discovered).toBe(true);
    
    // Item interaction
    room.generateContent();
    const item = room.items.find(i => i.canTake);
    if (item) {
      const result = player.takeItem(item, room);
      expect(result.success).toBe(true);
      expect(player.memoryFragments).toBeGreaterThan(0);
    }
    
    // Puzzle interaction if present
    if (room.puzzle) {
      const puzzleResult = room.puzzle.attempt(room.puzzle.solution);
      expect(puzzleResult.success).toBe(true);
    }
  });
}); 