import { Treasure } from '../Treasure';

export class BrokenMirror extends Treasure {
  constructor() {
    super(
      'broken_mirror',
      'Broken Mirror',
      'Even shattered, it reflects something more than reality...',
      'rare',
      {
        type: 'passive',
        effect: (combat) => {
          // 20% chance to dodge attacks
          combat.addEffect('dodge', 0.2);
        },
        description: '20% chance to dodge attacks'
      }
    );
  }
} 