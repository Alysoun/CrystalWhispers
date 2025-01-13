import { Achievements } from './mocks/Achievements';

describe('Achievement System', () => {
  test('Achievement Triggers', () => {
    const stats = {
      roomsDiscovered: 10,
      puzzlesSolved: 1,
      totalFragments: 100
    };
    
    const explorer = Achievements.categories.EXPLORATION.achievements.PATHFINDER;
    expect(explorer.condition(stats)).toBe(true);
    
    const fragments = Achievements.categories.COLLECTION.achievements.CRYSTAL_GATHERER;
    expect(fragments.condition(stats)).toBe(true);
  });
}); 