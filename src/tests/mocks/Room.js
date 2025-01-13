export class Room {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.items = [];
    this.features = [];
    this.discovered = false;
  }

  generateContent() {
    this.items = [
      {
        name: 'test item',
        description: 'A test item for testing',
        canTake: true,
        onTake: {
          fragments: 10,
          message: 'The item dissolves into memory fragments...'
        }
      }
    ];
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    return {
      success: true,
      fragments: item.onTake.fragments,
      message: 'The item dissolves into memory fragments...'
    };
  }

  examineFeature(featureName) {
    const feature = this.features.find(f => f.toLowerCase().includes(featureName.toLowerCase()));
    if (feature) {
      return {
        description: feature,
        fragments: Math.floor(Math.random() * 10), // Random fragments 0-9
        message: "You examine the " + featureName
      };
    }
    return null;
  }
} 