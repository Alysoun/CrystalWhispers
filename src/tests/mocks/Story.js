export const Story = {
  getPhaseDialogue: (progress) => {
    const dialogues = [
      "The beginning of your journey...",
      "After defeating the first boss...",
      "Further into the depths..."
    ];
    return dialogues[progress] || dialogues[0];
  },
  
  updateProgress: (gameState) => {
    // Initialize if undefined
    gameState.bossesDefeated = gameState.bossesDefeated || [];
    gameState.storyProgress = gameState.storyProgress || 0;
    
    // Progress based on floor completion
    if (gameState.clearedFloors && gameState.clearedFloors.length > 0) {
      // Each cleared floor advances story
      gameState.storyProgress = gameState.clearedFloors.length;
    }

    // Boss defeats also advance story
    if (gameState.bossesDefeated.length > 0) {
      gameState.storyProgress = Math.max(
        gameState.storyProgress,
        gameState.bossesDefeated.length
      );
    }
  }
}; 