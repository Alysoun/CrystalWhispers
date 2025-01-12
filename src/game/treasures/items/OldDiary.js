import { Treasure } from '../Treasure';

export class OldDiary extends Treasure {
  constructor() {
    super(
      'old_diary',
      'Old Diary',
      'Pages filled with familiar handwriting. Some entries seem to predict enemy actions.',
      'uncommon',
      {
        type: 'passive',
        effect: (combat) => {
          // Chance to reveal enemy's next action
          combat.addEffect('foresight', 0.3);
        },
        description: '30% chance to reveal enemy\'s next action'
      }
    );
  }
} 