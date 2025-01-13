export class TreasurePool {
  constructor() {
    this.discoveredTreasures = new Set();
    this.allTreasures = new Map([
      ['test_treasure_1', { id: 'test_treasure_1', name: 'Test Treasure 1' }],
      ['test_treasure_2', { id: 'test_treasure_2', name: 'Test Treasure 2' }]
    ]);
  }

  getRandomTreasure() {
    const treasures = Array.from(this.allTreasures.values());
    return treasures[0]; // Always return first treasure for testing
  }

  discoverTreasure(id) {
    this.discoveredTreasures.add(id);
  }

  isDiscovered(id) {
    return this.discoveredTreasures.has(id);
  }
} 