import { Room } from './mocks/Room';
import { Player } from './mocks/Player';

describe('Item System', () => {
  test('Item Generation and Properties', () => {
    const room = new Room(0, 0, 0);
    room.generateContent();
    
    const items = room.items.filter(item => item.canTake);
    items.forEach(item => {
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
      if(item.onTake) {
        expect(item.onTake.fragments).toBeGreaterThan(0);
      }
    });
  });

  test('Item Interaction', () => {
    const room = new Room(0, 0, 0);
    const player = new Player();
    
    // Test taking an item
    const takeableItem = room.items.find(item => item.canTake);
    if(takeableItem) {
      const result = player.takeItem(takeableItem, room);
      expect(result.success).toBe(true);
      expect(result.fragments).toBeGreaterThan(0);
      expect(room.items).not.toContain(takeableItem);
    }
  });

  test('Item Dissolves On Take', () => {
    const room = new Room(0, 0, 0);
    room.generateContent();
    const initialFragments = 0;
    
    const takeableItem = room.items.find(item => item.canTake);
    if(takeableItem) {
      const result = room.removeItem(takeableItem);
      expect(result.success).toBe(true);
      expect(result.fragments).toBeGreaterThan(initialFragments);
      expect(result.message).toContain('dissolves');
      expect(room.items).not.toContain(takeableItem);
    }
  });
}); 