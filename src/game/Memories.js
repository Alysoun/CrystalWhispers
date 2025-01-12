// Permanent upgrades obtained through playing
export const Memories = {
  categories: {
    STRENGTH: {
      name: "Remembered Strength",
      description: "Memories of being stronger",
      upgrades: {
        DETERMINATION: {
          name: "Determination",
          description: "Each victory makes you stronger",
          maxLevel: 10,
          effect: (level) => ({
            attackBonus: level * 2
          }),
          cost: (level) => 100 * Math.pow(1.5, level)
        },
        RESILIENCE: {
          name: "Resilience",
          description: "Memories of enduring hardship",
          maxLevel: 10,
          effect: (level) => ({
            healthBonus: level * 10
          }),
          cost: (level) => 100 * Math.pow(1.5, level)
        },
        TECHNIQUE: {
          name: "Combat Technique",
          description: "Memories of fighting more effectively",
          maxLevel: 5,
          effect: (level) => ({
            criticalChance: level * 5 // percentage
          }),
          cost: (level) => 150 * Math.pow(1.8, level)
        }
      }
    },
    INSIGHT: {
      name: "Gained Insight",
      description: "Understanding gained through experience",
      upgrades: {
        RECOGNITION: {
          name: "Pattern Recognition",
          description: "Enemy tells become more obvious",
          maxLevel: 5,
          effect: (level) => ({
            enemyTellDuration: 1 + (level * 0.2)
          }),
          cost: (level) => 150 * Math.pow(2, level)
        },
        PREPARATION: {
          name: "Better Preparation",
          description: "Start each run with bonus items",
          maxLevel: 3,
          effect: (level) => ({
            startingItems: level
          }),
          cost: (level) => 200 * Math.pow(2, level)
        },
        AWARENESS: {
          name: "Spatial Awareness",
          description: "Reveals more of the map when discovering new rooms",
          maxLevel: 3,
          effect: (level) => ({
            mapReveal: level + 1
          }),
          cost: (level) => 175 * Math.pow(2, level)
        }
      }
    },
    SURVIVAL: {
      name: "Will to Survive",
      description: "Memories of perseverance",
      upgrades: {
        RECOVERY: {
          name: "Quick Recovery",
          description: "Chance to heal after combat",
          maxLevel: 5,
          effect: (level) => ({
            healChance: level * 10, // percentage
            healAmount: 5 + (level * 3)
          }),
          cost: (level) => 175 * Math.pow(1.8, level)
        },
        ADAPTATION: {
          name: "Adaptation",
          description: "Gain temporary defense when hit",
          maxLevel: 5,
          effect: (level) => ({
            tempDefense: level * 2,
            duration: 2
          }),
          cost: (level) => 150 * Math.pow(1.7, level)
        }
      }
    }
  },

  // Memory Fragment earning events
  fragmentSources: {
    BOSS_DEFEAT: {
      amount: 100,
      message: "Boss defeated: Significant memory recovered"
    },
    ROOM_DISCOVERY: {
      amount: 5,
      message: "New area explored: Faint memory surfaces"
    },
    PUZZLE_SOLVE: {
      amount: 25,
      message: "Puzzle solved: Memory becomes clearer"
    },
    DEATH: {
      amount: 20,
      message: "Lesson learned: Memory crystallized"
    },
    SECRET_FIND: {
      amount: 15,
      message: "Secret discovered: Memory fragment recovered"
    }
  },

  // Interface methods
  isUnlocked: false,

  unlockMemories() {
    this.isUnlocked = true;
    return [
      "As you fade away, something crystallizes...",
      "Perhaps death is not the end, but a way to grow stronger...",
      "Your memories, though scattered, might be the key to proceeding..."
    ];
  },

  canPurchaseUpgrade(category, upgrade, currentLevel, fragments) {
    const upgradeInfo = this.categories[category].upgrades[upgrade];
    return (
      currentLevel < upgradeInfo.maxLevel &&
      fragments >= upgradeInfo.cost(currentLevel)
    );
  },

  purchaseUpgrade(category, upgrade, currentLevel, fragments) {
    if (!this.canPurchaseUpgrade(category, upgrade, currentLevel, fragments)) {
      return null;
    }

    const upgradeInfo = this.categories[category].upgrades[upgrade];
    const cost = upgradeInfo.cost(currentLevel);
    const effect = upgradeInfo.effect(currentLevel + 1);

    return {
      newLevel: currentLevel + 1,
      remainingFragments: fragments - cost,
      effect
    };
  }
}; 