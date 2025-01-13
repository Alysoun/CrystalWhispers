import { Room } from './Room';

export class TrapRoom {
  constructor(id, x, y, width, height, theme, dungeon) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.dungeon = dungeon;
    this.isDisarmed = false;
    
    this.trapType = this.generateTrapType();
  }

  generateTrapType() {
    const trapTypes = [
      {
        name: "Pressure Plate",
        description: "A suspicious plate in the floor",
        difficulty: 1,
        damage: 10,
        effect: (player) => {
          player.takeDamage(10);
          return "The pressure plate triggers, dealing 10 damage!";
        },
        disarmMethods: ["lockpick", "strength", "agility"]
      },
      {
        name: "Poison Dart",
        description: "Small holes line the walls",
        difficulty: 2,
        damage: 15,
        effect: (player) => {
          player.takeDamage(15);
          return "Poison darts shoot from the walls, dealing 15 damage!";
        },
        disarmMethods: ["perception", "agility", "intelligence"]
      },
      {
        name: "Magical Rune",
        description: "A glowing rune pulses ominously",
        difficulty: 3,
        damage: 20,
        effect: (player) => {
          player.takeDamage(20);
          return "The magical rune explodes, dealing 20 damage!";
        },
        disarmMethods: ["intelligence", "wisdom", "arcana"]
      }
    ];

    const index = Math.floor(Math.random() * trapTypes.length);
    return trapTypes[index];
  }

  getDescription() {
    return this.isDisarmed 
      ? `A disarmed ${this.trapType.name} trap.`
      : this.trapType.description;
  }

  trigger() {
    if (this.isDisarmed) {
      return {
        triggered: false,
        message: "The trap has been disarmed."
      };
    }

    return {
      triggered: true,
      message: this.trapType.description,
      damage: this.trapType.damage
    };
  }

  attemptDisarm(method, input, player) {
    if (this.isDisarmed) {
      return { 
        success: false, 
        message: "This trap is already disarmed." 
      };
    }

    if (!this.trapType.disarmMethods.includes(method)) {
      return {
        success: false,
        message: `You can't disarm this trap using ${method}.`,
        damage: this.trapType.damage / 2
      };
    }

    // Base success chance
    let successChance = 0.5;

    // Add bonus from Safe Passage upgrade
    const safePassageLevel = player?.upgrades?.explorer?.safePassage || 0;
    successChance += safePassageLevel * 0.15;

    const roll = Math.random();
    if (roll < successChance) {
      this.isDisarmed = true;
      return {
        success: true,
        message: "You successfully disarm the trap!",
        fragments: Math.floor(Math.random() * 20) + 10 // 10-30 fragments
      };
    }

    return {
      success: false,
      message: "You fail to disarm the trap!",
      damage: Math.floor(this.trapType.damage / 2)
    };
  }
} 