export const ExpScaling = {
  getExpForNextLevel(currentLevel) {
    // Base exp needed is 100, increases by 50% each level
    return Math.floor(100 * Math.pow(1.5, currentLevel - 1));
  },

  getExpProgress(currentExp, currentLevel) {
    const nextLevelExp = this.getExpForNextLevel(currentLevel);
    return {
      current: currentExp,
      needed: nextLevelExp,
      percentage: (currentExp / nextLevelExp) * 100
    };
  }
}; 