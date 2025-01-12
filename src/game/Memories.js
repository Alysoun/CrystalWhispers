// Permanent upgrades obtained through playing
export const Memories = {
  categories: {
    combat: {
      name: "Combat Prowess",
      description: "Enhance your fighting abilities",
      upgrades: {
        strength: {
          name: "Strength",
          description: "Increase your base attack damage",
          maxLevel: 5,
          cost: (level) => Math.floor(50 * Math.pow(1.5, level)),
          effect: (level) => ({ 
            attack: level * 2 
          })
        },
        defense: {
          name: "Resilience",
          description: "Improve your defensive capabilities",
          maxLevel: 5,
          cost: (level) => Math.floor(50 * Math.pow(1.5, level)),
          effect: (level) => ({ 
            defense: level * 1.5 
          })
        },
        health: {
          name: "Vitality",
          description: "Increase your maximum health",
          maxLevel: 5,
          cost: (level) => Math.floor(75 * Math.pow(1.5, level)),
          effect: (level) => ({ 
            maxHealth: level * 10 
          })
        }
      }
    },
    exploration: {
      name: "Exploration Skills",
      description: "Improve your ability to navigate and survive",
      upgrades: {
        mapping: {
          name: "Memory Mapping",
          description: "Reveal more of the map when discovering new rooms",
          maxLevel: 3,
          cost: (level) => Math.floor(100 * Math.pow(2, level)),
          effect: (level) => ({ 
            mapReveal: level + 1 
          })
        },
        retention: {
          name: "Memory Retention",
          description: "Keep more fragments when dying",
          maxLevel: 3,
          cost: (level) => Math.floor(150 * Math.pow(2, level)),
          effect: (level) => ({ 
            fragmentRetention: 0.2 + (level * 0.1) 
          })
        }
      }
    },
    puzzle: {
      name: "Puzzle Mastery",
      description: "Enhance your puzzle-solving abilities",
      upgrades: {
        insight: {
          name: "Puzzle Insight",
          description: "Gain better hints and more attempts at puzzles",
          maxLevel: 3,
          cost: (level) => Math.floor(100 * Math.pow(1.8, level)),
          effect: (level) => ({ 
            puzzleAttempts: level + 1,
            hintQuality: level 
          })
        },
        protection: {
          name: "Mental Protection",
          description: "Take less damage from failed puzzle attempts",
          maxLevel: 3,
          cost: (level) => Math.floor(75 * Math.pow(1.8, level)),
          effect: (level) => ({ 
            puzzleDamageReduction: level * 0.25 
          })
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
    const upgradeInfo = this.categories[category]?.upgrades[upgrade];
    if (!upgradeInfo) return false;

    return (
      currentLevel < upgradeInfo.maxLevel && 
      fragments >= upgradeInfo.cost(currentLevel)
    );
  },

  purchaseUpgrade(category, upgrade, currentLevel, fragments) {
    if (!this.canPurchaseUpgrade(category, upgrade, currentLevel, fragments)) {
      return null;
    }

    const cost = this.categories[category].upgrades[upgrade].cost(currentLevel);
    return {
      success: true,
      newLevel: currentLevel + 1,
      remainingFragments: fragments - cost
    };
  }
}; 