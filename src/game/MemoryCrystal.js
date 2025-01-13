export const MemoryCrystal = {
  types: {
    DEFIANCE: {
      name: "Crystal of Defiance",
      description: (count) => `Enemies gain +${25 * count}% health and damage, rewards scale with difficulty`,
      effect: (count) => ({
        enemyHealth: 1 + (0.25 * count),
        enemyDamage: 1 + (0.25 * count),
        lootQuality: 1 + (0.5 * count)
      })
    },

    RESILIENCE: {
      name: "Crystal of Resilience",
      description: (count) => `Enemy abilities ${count > 1 ? 'trigger more frequently and' : ''} are ${20 * count}% stronger`,
      effect: (count) => ({
        abilityCooldown: Math.max(0.5, 1 - (0.1 * count)),
        abilityPower: 1 + (0.2 * count),
        experienceGain: 1 + (0.3 * count)
      })
    },

    REFLECTION: {
      name: "Crystal of Reflection",
      description: (count) => `Bosses gain ${count} additional abilities at a time`,
      effect: (count) => ({
        additionalAbilities: count,
        uniqueDropRate: 1 + (0.25 * count)
      })
    },

    CHALLENGE: {
      name: "Crystal of Challenge",
      description: (count) => `All enemies are ${2 * count} levels higher`,
      effect: (count) => ({
        enemyLevel: 2 * count,
        allRewards: 1 + (count * 0.5)
      })
    }
  },

  calculateModifiers(activeCrystals) {
    // Count crystals of each type
    const crystalCounts = activeCrystals.reduce((counts, crystal) => {
      if (this.types[crystal]) { // Only count valid crystal types
        counts[crystal] = (counts[crystal] || 0) + 1;
      }
      return counts;
    }, {});

    // Start with base modifiers
    const baseModifiers = {
      enemyHealth: 1,
      enemyDamage: 1,
      lootQuality: 1,
      experienceGain: 1,
      enemyLevel: 0,
      uniqueDropRate: 1,
      abilityPower: 1,
      abilityCooldown: 1,
      additionalAbilities: 0,
      allRewards: 1
    };

    // Apply stacking effects for each crystal type
    return Object.entries(crystalCounts).reduce((mods, [crystalType, count]) => {
      if (!this.types[crystalType]) return mods; // Skip invalid types
      
      const crystalEffect = this.types[crystalType].effect(count);
      
      return {
        ...mods,
        ...Object.entries(crystalEffect).reduce((acc, [key, value]) => {
          if (typeof value === 'number') {
            // Multiplicative scaling for rates and multipliers
            if (key.includes('Rate') || key.includes('Quality')) {
              acc[key] = mods[key] * value;
            }
            // Additive scaling for levels and ability counts
            else if (key.includes('Level') || key.includes('Abilities')) {
              acc[key] = mods[key] + value;
            }
            // Multiplicative with diminishing returns for others
            else {
              acc[key] = mods[key] * (1 + Math.log(value));
            }
          }
          return acc;
        }, {})
      };
    }, baseModifiers);
  },

  // Modify a boss based on active crystals
  modifyBoss(boss, activeCrystals) {
    const mods = this.calculateModifiers(activeCrystals);
    const modifiedBoss = { ...boss };

    // Apply stat modifications
    modifiedBoss.health = Math.floor(boss.health * mods.enemyHealth);
    modifiedBoss.maxHealth = modifiedBoss.health;
    modifiedBoss.attack = Math.floor(boss.attack * mods.enemyDamage);
    
    // Add advanced abilities if applicable
    if (mods.additionalAbilities > 0) {
      modifiedBoss.phases.forEach(phase => {
        // Enable additional abilities for each phase
        const availableAbilities = Object.keys(boss.specialAbilities);
        phase.activeAbilities = Array.from(new Set([
          ...phase.activeAbilities,
          ...availableAbilities
        ]));
      });
    }

    return modifiedBoss;
  },

  // Get available crystals based on game completion
  getAvailableCrystals(completedRuns) {
    const crystals = [];
    if (completedRuns >= 1) crystals.push('DEFIANCE');
    if (completedRuns >= 2) crystals.push('RESILIENCE');
    if (completedRuns >= 3) crystals.push('REFLECTION');
    if (completedRuns >= 5) crystals.push('CHALLENGE');
    return crystals;
  }
};

/**
 * Calculates memory fragment gain based on level and base amount
 * @param {number} level - Current level
 * @param {number} baseAmount - Base amount of fragments
 * @returns {number} - Final fragment amount after level scaling
 */
export const calculateFragmentGain = (level, baseAmount) => {
  // Ensure valid inputs
  const safeLevel = Math.max(1, level);
  const safeBaseAmount = Math.max(0, baseAmount);
  
  // Scale fragments with level
  const levelMultiplier = 1 + (safeLevel - 1) * 0.1; // 10% increase per level
  return Math.floor(safeBaseAmount * levelMultiplier);
}; 