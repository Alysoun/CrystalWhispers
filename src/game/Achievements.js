export const Achievements = {
  // Achievement categories
  categories: {
    EXPLORATION: {
      name: "Explorer's Path",
      achievements: {
        ROOM_DISCOVERER: {
          id: 'room_discoverer',
          name: 'Room Discoverer',
          description: 'Discover your first room',
          condition: (stats) => stats.roomsDiscovered >= 1,
          reward: {
            fragments: 10,
            message: "Your curiosity is rewarded..."
          }
        },
        CARTOGRAPHER: {
          id: 'cartographer',
          name: 'Cartographer',
          description: 'Discover 20 rooms',
          condition: (stats) => stats.roomsDiscovered >= 20,
          reward: {
            fragments: 50,
            message: "The maze begins to make sense..."
          }
        }
      }
    },
    COMBAT: {
      name: "Warrior's Journey",
      achievements: {
        MIRROR_KEEPER: {
          id: 'mirror_keeper',
          name: 'Face Your Reflection',
          description: 'Defeat the Mirror Keeper',
          condition: (stats) => stats.bossesDefeated.includes('mirror_keeper'),
          reward: {
            fragments: 100,
            message: "You begin to understand yourself..."
          }
        },
        SURVIVOR: {
          id: 'survivor',
          name: 'Survivor',
          description: 'Survive 10 enemy encounters',
          condition: (stats) => stats.combatsWon >= 10,
          reward: {
            fragments: 30,
            message: "Your combat instincts sharpen..."
          }
        }
      }
    },
    PUZZLES: {
      name: "Seeker's Wisdom",
      achievements: {
        FIRST_SOLUTION: {
          id: 'first_solution',
          name: 'First Solution',
          description: 'Solve your first puzzle',
          condition: (stats) => stats.puzzlesSolved >= 1,
          reward: {
            fragments: 15,
            message: "Understanding dawns..."
          }
        },
        PUZZLE_MASTER: {
          id: 'puzzle_master',
          name: 'Puzzle Master',
          description: 'Solve 5 puzzles without failing',
          condition: (stats) => stats.perfectPuzzles >= 5,
          reward: {
            fragments: 75,
            message: "Your mind grows sharper..."
          }
        }
      }
    },
    COLLECTION: {
      name: "Collector's Journey",
      achievements: {
        CRYSTAL_GATHERER: {
          id: 'crystal_gatherer',
          name: 'Crystal Gatherer',
          description: 'Collect 100 memory fragments',
          condition: (stats) => stats.totalFragments >= 100,
          reward: {
            fragments: 25,
            message: "Memories crystallize..."
          }
        },
        TREASURE_HUNTER: {
          id: 'treasure_hunter',
          name: 'Treasure Hunter',
          description: 'Find 5 unique treasures',
          condition: (stats) => stats.uniqueTreasures >= 5,
          reward: {
            fragments: 50,
            message: "The past leaves its gifts..."
          }
        }
      }
    },
    INTERFACE: {
      name: "System Interface",
      achievements: {
        HELP_FOUND: {
          id: 'help_found',
          name: 'User Manual Located',
          description: 'Found the help system',
          condition: (stats) => stats.helpUsed,
          reward: {
            fragments: 5,
            message: "Knowledge gained..."
          }
        }
      }
    }
  },

  // Check for newly completed achievements
  checkAchievements(stats, unlockedAchievements) {
    const newlyUnlocked = [];
    
    Object.values(this.categories).forEach(category => {
      Object.values(category.achievements).forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id) && 
            achievement.condition(stats)) {
          newlyUnlocked.push(achievement);
        }
      });
    });

    return newlyUnlocked;
  },

  // Get achievement details by ID
  getAchievement(achievementId) {
    for (const category of Object.values(this.categories)) {
      for (const [id, achievement] of Object.entries(category.achievements)) {
        if (achievement.id === achievementId) {
          return achievement;
        }
      }
    }
    return null;
  }
}; 