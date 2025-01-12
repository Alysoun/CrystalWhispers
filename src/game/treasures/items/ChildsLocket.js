import { Treasure } from '../Treasure';

export class ChildsLocket extends Treasure {
  constructor() {
    super(
      'childs_locket',
      'Child\'s Locket',
      'A small golden locket containing a faded photograph. It fills you with determination.',
      'rare',
      {
        type: 'passive',
        effect: (combat) => {
          // Gain strength when at low health
          if (combat.player.health < combat.player.maxHealth * 0.3) {
            combat.addEffect('strength', 1.5);
          }
        },
        description: 'Increases attack by 50% when below 30% health'
      }
    );
  }
} 