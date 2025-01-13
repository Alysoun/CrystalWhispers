// Permanent upgrades obtained through playing
export const Memories = {
  categories: {
    starter: {
      name: "Starter Equipment",
      description: "Basic equipment to help you survive longer",
      upgrades: {
        trainingBlade: {
          name: "Training Blade",
          description: "A basic blade that grants +2 attack",
          maxLevel: 1,
          cost: () => 50,
          effect: () => ({ 
            attackBonus: 2,
            oneTime: true 
          })
        },
        leatherArmor: {
          name: "Leather Armor",
          description: "Basic protection that reduces damage taken by 1",
          maxLevel: 1,
          cost: () => 75,
          effect: () => ({ 
            defenseBonus: 1,
            oneTime: true 
          })
        },
        healingCharm: {
          name: "Healing Charm",
          description: "Regenerate 1 HP after each combat",
          maxLevel: 1,
          cost: () => 100,
          effect: () => ({ 
            healAfterCombat: 1,
            oneTime: true 
          })
        }
      }
    },
    combat: {
      name: "Combat Mastery",
      description: "Enhance your combat abilities",
      upgrades: {
        vitality: {
          name: "Vitality",
          description: "Increase your maximum health",
          maxLevel: 5,
          cost: (level) => Math.floor(125 * Math.pow(2.0, level)),
          effect: (level) => ({ 
            healthBonus: level * 10  // +10 HP per level
          })
        },
        strength: {
          name: "Strength",
          description: "Increase damage dealt in combat",
          maxLevel: 5,
          cost: (level) => Math.floor(100 * Math.pow(2.2, level)),
          effect: (level) => ({ 
            damageBonus: level * 2 
          })
        },
        resilience: {
          name: "Resilience",
          description: "Reduce damage taken in combat",
          maxLevel: 5,
          cost: (level) => Math.floor(150 * Math.pow(2.1, level)),
          effect: (level) => ({ 
            damageReduction: level * 0.1 
          })
        }
      }
    },
    exploration: {
      name: "Explorer's Insight",
      description: "Improve your exploration abilities",
      upgrades: {
        perception: {
          name: "Perception",
          description: "Better chance to find hidden treasures",
          maxLevel: 3,
          cost: (level) => Math.floor(200 * Math.pow(2.5, level)),
          effect: (level) => ({ 
            treasureChance: 0.1 + (level * 0.15)
          })
        },
        retention: {
          name: "Memory Retention",
          description: "Retain more memory fragments upon death",
          maxLevel: 5,
          cost: (level) => Math.floor(300 * Math.pow(1.5, level)),
          effect: (level) => ({
            retentionBonus: level * 0.1  // Each level reduces loss by 10% (up to 50% at max)
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

  // Stats unlock costs
  statUnlockCosts: {
    healthNumbers: 50,
    experience: 150,
    attack: 250,
    defense: 250
  },

  // Memory Fragment earning events
  fragmentSources: {
    BOSS_DEFEAT: {
      amount: 500,
      message: "Boss defeated: Significant memory recovered"
    },
    ROOM_DISCOVERY: {
      amount: 25,
      message: "New area explored: Faint memory surfaces"
    },
    PUZZLE_SOLVE: {
      amount: 150,
      message: "Puzzle solved: Memory becomes clearer"
    },
    DEATH: {
      amount: 100,
      message: "Lesson learned: Memory crystallized"
    },
    SECRET_FIND: {
      amount: 75,
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