export const Achievements = {
  categories: {
    EXPLORATION: {
      name: "Explorer's Path",
      achievements: {
        PATHFINDER: {
          id: 'pathfinder',
          name: 'Pathfinder',
          description: 'Discover 10 rooms',
          condition: (stats) => stats.roomsDiscovered >= 10,
          reward: {
            fragments: 25,
            message: "The path becomes clearer..."
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
        }
      }
    }
  }
}; 