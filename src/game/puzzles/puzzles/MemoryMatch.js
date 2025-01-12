import { Puzzle } from '../Puzzle';

export class MemoryMatch extends Puzzle {
  constructor() {
    super(
      'memory_match',
      'Memory Match',
      'Match the symbols in the correct order...',
      1, // difficulty
      '/images/puzzles/memory_match.png'
    );

    this.sequence = this.generateSequence();
    this.hints = [
      'Try to remember the order...',
      'The symbols form a pattern...',
      'Look for pairs of matching symbols...'
    ];
  }

  generateSequence() {
    const symbols = ['★', '♦', '♠', '♣', '♥'];
    const sequence = [];
    
    // Generate 3 pairs of matching symbols
    for (let i = 0; i < 3; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      sequence.push(symbol, symbol);
    }
    
    // Shuffle the sequence
    return sequence.sort(() => Math.random() - 0.5);
  }

  checkSolution(answer) {
    this.attempts++;
    const correct = answer === this.sequence.join('');
    if (correct) this.solved = true;
    return correct;
  }

  getHint() {
    return this.hints[Math.min(this.attempts, this.hints.length - 1)];
  }
} 