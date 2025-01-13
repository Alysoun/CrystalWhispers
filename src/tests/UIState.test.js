import { Player } from './mocks/Player';

describe('UI State Changes', () => {
  test('Stats Visibility', () => {
    const player = new Player();
    const gameState = {
      unlockedStats: {
        health: true,
        healthNumbers: false
      }
    };
    
    // Test unlocking stats
    player.unlockStat('healthNumbers', gameState);
    expect(gameState.unlockedStats.healthNumbers).toBe(true);
  });
}); 