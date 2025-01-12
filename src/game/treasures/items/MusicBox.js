import { Treasure } from '../Treasure';

export class MusicBox extends Treasure {
  constructor() {
    super(
      'music_box',
      'Forgotten Music Box',
      'Its melody brings peace to troubled souls.',
      'uncommon',
      {
        type: 'active',
        uses: 3,
        effect: (combat) => {
          // Heal and remove negative status effects
          combat.player.heal(20);
          combat.removeNegativeEffects();
        },
        description: 'Heal 20 HP and remove negative status effects (3 uses per run)'
      }
    );
  }
} 