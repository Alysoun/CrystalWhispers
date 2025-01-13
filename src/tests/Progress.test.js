import { Story } from './mocks/Story';

describe('Game Progress', () => {
  test('Story Advancement', () => {
    const gameState = {
      bossesDefeated: [],
      storyProgress: 0
    };
    
    // Defeat first boss
    gameState.bossesDefeated.push('DENIAL');
    Story.updateProgress(gameState);
    
    expect(gameState.storyProgress).toBeGreaterThan(0);
    expect(Story.getPhaseDialogue(gameState.storyProgress)).toBeDefined();
  });
}); 