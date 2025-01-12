export const ExpScaling = {
  // Base experience values for each area/level
  areaBaseExp: {
    1: { // Denial area
      minLevel: 1,
      maxLevel: 5,
      baseExp: 100,
      bossExp: 500
    },
    2: { // Anger area
      minLevel: 4,
      maxLevel: 8,
      baseExp: 200,
      bossExp: 1000
    },
    3: { // Bargaining area
      minLevel: 7,
      maxLevel: 11,
      baseExp: 400,
      bossExp: 1500
    },
    4: { // Depression area
      minLevel: 10,
      maxLevel: 14,
      baseExp: 800,
      bossExp: 2000
    },
    5: { // Acceptance area
      minLevel: 13,
      maxLevel: 17,
      baseExp: 1600,
      bossExp: 3000
    }
  },

  // Experience scaling based on level difference
  calculateExpGain(baseExp, playerLevel, areaLevel) {
    const levelDiff = playerLevel - areaLevel;
    let multiplier = 1;

    if (levelDiff > 0) {
      // Reduce experience for over-leveled players
      multiplier = Math.max(0.1, 1 - (levelDiff * 0.2));
    } else if (levelDiff < 0) {
      // Bonus experience for under-leveled players
      multiplier = Math.min(1.5, 1 + (Math.abs(levelDiff) * 0.1));
    }

    return Math.floor(baseExp * multiplier);
  },

  // New Game+ scaling
  newGamePlusModifiers: {
    expGain: (ngPlusLevel) => 1 + (ngPlusLevel * 0.2), // 20% more exp per NG+
    bossAbilities: (ngPlusLevel) => Math.min(ngPlusLevel, 3) // Up to 3 additional abilities
  },

  // Boss ability unlocks based on player progress
  getBossAbilities(boss, playerLevel, ngPlusLevel) {
    const baseAbilities = boss.phases[0].activeAbilities;
    
    // Unlock more abilities based on NG+ level
    if (ngPlusLevel > 0) {
      const extraAbilities = Object.keys(boss.specialAbilities)
        .filter(ability => !baseAbilities.includes(ability))
        .slice(0, this.newGamePlusModifiers.bossAbilities(ngPlusLevel));
      
      return [...baseAbilities, ...extraAbilities];
    }

    return baseAbilities;
  }
}; 