import { Treasure } from '../Treasure';

export class StabilizingCrystal extends Treasure {
  constructor() {
    super(
      'stabilizing_crystal',
      'Stabilizing Crystal',
      'A crystal humming with stabilizing energy. It might prevent a puzzle from being destroyed...',
      'rare',
      {
        type: 'active',
        uses: 1,
        effect: (puzzle) => {
          if (puzzle && !puzzle.solved && !puzzle.destroyed) {
            puzzle.maxAttempts += 1; // Grants one additional attempt
            return true;
          }
          return false;
        },
        description: 'Grants one additional attempt at a puzzle (consumed on use)'
      }
    );
  }
} 