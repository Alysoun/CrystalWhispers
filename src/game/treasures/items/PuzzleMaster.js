import { Treasure } from '../Treasure';

export class PuzzleMaster extends Treasure {
  constructor() {
    super(
      'puzzle_master',
      'Cryptographer\'s Lens',
      'A mysterious lens that seems to reveal hidden patterns. Perhaps it could help with particularly difficult puzzles...',
      'legendary',
      {
        type: 'active',
        uses: 1,
        effect: (puzzle) => {
          if (puzzle && !puzzle.solved && !puzzle.destroyed) {
            return puzzle.solution; // Reveals the solution
          }
          return null;
        },
        description: 'Reveals the solution to one puzzle (consumed on use)'
      }
    );
  }
} 