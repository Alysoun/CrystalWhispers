import { TreasurePool } from './mocks/TreasurePool';

describe('Treasure System', () => {
  test('Treasure Discovery', () => {
    const treasurePool = new TreasurePool();
    const treasure = treasurePool.getRandomTreasure();
    
    expect(treasure).toBeDefined();
    expect(treasure.id).toBeDefined();
    
    treasurePool.discoverTreasure(treasure.id);
    expect(treasurePool.isDiscovered(treasure.id)).toBe(true);
  });

  test('Multiple Treasure Discovery', () => {
    const treasurePool = new TreasurePool();
    const allTreasures = Array.from(treasurePool.allTreasures.values());
    
    allTreasures.forEach(treasure => {
      treasurePool.discoverTreasure(treasure.id);
      expect(treasurePool.isDiscovered(treasure.id)).toBe(true);
    });
  });
}); 