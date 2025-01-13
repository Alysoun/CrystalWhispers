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
        },
        precisionStrike: {
          name: "Precision Strike",
          description: "Increases your chance to deal critical hits",
          maxLevel: 5,
          cost: (level) => Math.floor(200 * Math.pow(2.3, level)),
          effect: (level) => ({ 
            critChance: level * 0.05  // 5% per level
          })
        },
        adrenalineRush: {
          name: "Adrenaline Rush",
          description: "Boost attack when at low health",
          maxLevel: 3,
          cost: (level) => Math.floor(250 * Math.pow(2, level)),
          effect: (level) => ({ 
            lowHealthAttackBonus: level * 3  // +3 attack when below 25% HP
          })
        },
        riposte: {
          name: "Riposte",
          description: "Chance to counterattack after being hit",
          maxLevel: 4,
          cost: (level) => Math.floor(300 * Math.pow(1.8, level)),
          effect: (level) => ({ 
            counterChance: level * 0.1  // 10% per level
          })
        }
      }
    },
    explorer: {
      name: "Explorer's Insight",
      description: "Master the art of dungeon exploration",
      upgrades: {
        treasureMagnet: {
          name: "Treasure Magnet",
          description: "Increases fragments found in chests",
          maxLevel: 4,
          cost: (level) => Math.floor(150 * Math.pow(2.2, level)),
          effect: (level) => ({ 
            fragmentBonus: level * 0.2  // 20% more per level
          })
        },
        mapAwareness: {
          name: "Map Awareness",
          description: "Reveals nearby rooms on the map",
          maxLevel: 3,
          cost: (level) => Math.floor(250 * Math.pow(1.9, level)),
          effect: (level) => ({ 
            mapRevealRadius: level  // +1 room radius per level
          })
        },
        safePassage: {
          name: "Safe Passage",
          description: "Reduced chance of traps triggering",
          maxLevel: 3,
          cost: (level) => Math.floor(200 * Math.pow(1.7, level)),
          effect: (level) => ({ 
            trapAvoidanceChance: level * 0.15  // 15% per level
          })
        }
      }
    },
    puzzleMaster: {
      name: "Puzzle Mastery",
      description: "Enhance your puzzle-solving abilities",
      upgrades: {
        timekeeperEye: {
          name: "Timekeeper's Eye",
          description: "Increases time limit for timed puzzles",
          maxLevel: 3,
          cost: (level) => Math.floor(150 * Math.pow(1.8, level)),
          effect: (level) => ({ 
            extraPuzzleTime: level * 5  // +5 seconds per level
          })
        },
        perfectClarity: {
          name: "Perfect Clarity",
          description: "Skip one puzzle without penalty",
          maxLevel: 1,
          cost: () => 500,
          effect: () => ({ 
            skipPuzzle: true
          })
        }
      }
    },
    survival: {
      name: "Survival Instinct",
      description: "Master the art of staying alive",
      upgrades: {
        lastStand: {
          name: "Last Stand",
          description: "Grants temporary invincibility at 1 HP",
          maxLevel: 1,
          cost: () => 250,
          effect: () => ({ 
            invincibilityTurns: 1
          })
        },
        potionBelt: {
          name: "Potion Belt",
          description: "Carry more potions",
          maxLevel: 3,
          cost: (level) => Math.floor(200 * Math.pow(1.6, level)),
          effect: (level) => ({ 
            extraPotions: level  // +1 potion per level
          })
        }
      }
    },
    tactical: {
      name: "Tactical Mastery",
      description: "Advanced combat strategies",
      upgrades: {
        battlefieldControl: {
          name: "Battlefield Control",
          description: "Reroll combat initiative once per battle",
          maxLevel: 1,
          cost: () => 400,
          effect: () => ({ 
            rerollInitiative: true
          })
        },
        strategistMind: {
          name: "Strategist's Mind",
          description: "Gain bonus actions in combat",
          maxLevel: 3,
          cost: (level) => Math.floor(300 * Math.pow(2, level)),
          effect: (level) => ({ 
            bonusActionInterval: 5 - level  // Every 5/4/3 turns
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