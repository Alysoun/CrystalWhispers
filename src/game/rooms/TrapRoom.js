import { Room } from './Room';

export class TrapRoom extends Room {
  constructor(id, x, y, width, height, theme, dungeon) {
    super(id, x, y, width, height, theme, dungeon);
    this.roomType = 'trap';
    this.trapType = this.generateTrapType();
    this.isDisarmed = false;
  }

  generateTrapType() {
    const traps = [
      {
        name: 'Memory Surge',
        description: 'Crackling energy fills the room, threatening to overload your systems...',
        difficulty: 2,
        effect: (player) => {
          if (!this.isDisarmed) {
            player.health -= Math.floor(player.maxHealth * 0.2);
            return 'The surge damages your systems!';
          }
          return 'The trap has been disarmed.';
        },
        disarmMethod: 'TIMING',
        fragments: 50
      },
      {
        name: 'Data Corruption',
        description: 'Corrupted code streams down the walls, attempting to infect your memory...',
        difficulty: 3,
        effect: (player) => {
          if (!this.isDisarmed) {
            player.memoryFragments = Math.max(0, player.memoryFragments - 10);
            return 'The corruption consumes some of your fragments!';
          }
          return 'The trap has been disarmed.';
        },
        disarmMethod: 'PATTERN',
        fragments: 75
      },
      {
        name: 'Recursive Loop',
        description: 'The room seems to fold in on itself, threatening to trap you in an endless cycle...',
        difficulty: 4,
        effect: (player) => {
          if (!this.isDisarmed) {
            player.stunned = true;
            return 'You become trapped in the loop!';
          }
          return 'The trap has been disarmed.';
        },
        disarmMethod: 'SEQUENCE',
        fragments: 100
      }
    ];

    return traps[Math.floor(Math.random() * traps.length)];
  }

  attemptDisarm(method, input) {
    if (this.isDisarmed) return { success: false, message: 'This trap is already disarmed.' };

    switch (this.trapType.disarmMethod) {
      case 'TIMING':
        const success = Math.random() < 0.5;
        return {
          success,
          message: success ? 'You successfully interrupt the surge!' : 'Your timing was off...',
          fragments: success ? this.trapType.fragments : 0
        };

      case 'PATTERN':
        return {
          success: input === this.trapType.pattern,
          message: input === this.trapType.pattern ? 
            'The corruption dissipates!' : 'The pattern was incorrect...',
          fragments: input === this.trapType.pattern ? this.trapType.fragments : 0
        };

      default:
        return { success: false, message: 'Unknown disarm method.' };
    }
  }

  getDescription() {
    return [
      this.trapType.description,
      this.isDisarmed ? 
        'The trap has been successfully disarmed.' :
        'The trap is still active and dangerous!'
    ].join('\n');
  }
} 