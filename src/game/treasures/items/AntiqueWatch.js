import { Treasure } from '../Treasure';

export class AntiqueWatch extends Treasure {
  constructor() {
    super(
      'antique_watch',
      'Antique Watch',
      'A pocket watch that seems to tick backwards. Perhaps time itself can be rewound...',
      'legendary',
      {
        type: 'active',
        uses: 1,
        effect: (combat) => {
          // Reset combat to starting state
          combat.rewindToStart();
        },
        description: 'Rewind time to the start of combat (one use per run)'
      }
    );
  }
} 