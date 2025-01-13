import { Dungeon } from '../game/DungeonGenerator';
import { Player } from './mocks/Player';
import { Room } from './mocks/Room';
import { Memories } from '../game/Memories';

describe('Core Game Functionality', () => {
  test('Dungeon Generation', () => {
    const dungeon = new Dungeon(50, 50, 20);
    expect(dungeon.rooms.size).toBeGreaterThanOrEqual(15);
    expect(dungeon.rooms.size).toBeLessThanOrEqual(30);
  });

  test('Memory Fragment System', () => {
    const player = new Player();
    expect(player.memoryFragments).toBe(0);
    player.addMemoryFragments(100);
    expect(player.memoryFragments).toBe(100);
  });

  test('Item Collection', () => {
    const room = new Room(0, 0, 0);
    room.generateContent();
    const takeableItem = room.items.find(item => item.canTake);
    if (takeableItem) {
      const result = room.removeItem(takeableItem);
      expect(result.success).toBe(true);
      expect(result.fragments).toBeGreaterThan(0);
    }
  });
}); 