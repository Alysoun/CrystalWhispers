import { MirrorSequence } from './puzzles/MirrorSequence';
import { TimeRiddle } from './puzzles/TimeRiddle';
import { MemoryMatch } from './puzzles/MemoryMatch';

export class PuzzlePool {
  constructor() {
    this.puzzles = new Map();
    this.initializePuzzles();
  }

  initializePuzzles() {
    const puzzleTypes = [
      MirrorSequence,
      TimeRiddle,
      MemoryMatch
    ];

    puzzleTypes.forEach(PuzzleType => {
      try {
        const puzzle = new PuzzleType();
        this.puzzles.set(puzzle.id, puzzle);
      } catch (error) {
        console.warn(`Failed to initialize puzzle type: ${PuzzleType.name}`, error);
      }
    });

    if (this.puzzles.size === 0) {
      console.warn('No puzzles were successfully initialized!');
      // Add a fallback puzzle to prevent crashes
      const fallbackPuzzle = new MirrorSequence();
      this.puzzles.set(fallbackPuzzle.id, fallbackPuzzle);
    }
  }

  getRandomPuzzle(difficulty = null) {
    const availablePuzzles = Array.from(this.puzzles.values())
      .filter(p => !p.solved && (difficulty ? p.difficulty === difficulty : true));
    
    if (availablePuzzles.length === 0) {
      // If no puzzles available at requested difficulty, return any unsolved puzzle
      const anyPuzzle = Array.from(this.puzzles.values())[0];
      anyPuzzle.solved = false; // Reset the puzzle
      return anyPuzzle;
    }
    
    return availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
  }
} 