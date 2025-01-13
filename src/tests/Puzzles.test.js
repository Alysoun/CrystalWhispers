import fc from 'fast-check';
import { PuzzleTypes } from '../game/puzzles/PuzzleTypes';

describe('Puzzle System', () => {
  test('Puzzle Generation', () => {
    Object.entries(PuzzleTypes).forEach(([type, puzzleType]) => {
      const puzzle = puzzleType.generatePuzzle(1);
      expect(puzzle.solution).toBeDefined();
      expect(puzzle.maxAttempts).toBeGreaterThan(0);
      expect(puzzle.reward).toBeGreaterThan(0);
    });
  });

  test('Puzzle Solving', () => {
    const puzzle = PuzzleTypes.MEMORY_MATCH.generatePuzzle(1);
    const correctSolution = puzzle.solution;
    
    const result = puzzle.checkSolution(correctSolution);
    expect(result.success).toBe(true);
    
    const wrongResult = puzzle.checkSolution('wrong');
    expect(wrongResult.success).toBe(false);
  });
});

describe('Puzzle System Properties', () => {
  test('Puzzle Rewards Always Positive', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 100), // level range
        (level) => {
          Object.values(PuzzleTypes).forEach(puzzleType => {
            const puzzle = puzzleType.generatePuzzle(level);
            return puzzle.reward > 0;
          });
        }
      )
    );
  });

  test('Wrong Solutions Never Succeed', () => {
    fc.assert(
      fc.property(
        fc.string(), // random wrong solutions
        (wrongSolution) => {
          const puzzle = PuzzleTypes.MEMORY_MATCH.generatePuzzle(1);
          if (wrongSolution !== puzzle.solution) {
            const result = puzzle.checkSolution(wrongSolution);
            return result.success === false;
          }
          return true;
        }
      )
    );
  });
}); 