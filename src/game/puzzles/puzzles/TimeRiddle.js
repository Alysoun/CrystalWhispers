import { Puzzle } from '../Puzzle';

export class TimeRiddle extends Puzzle {
  constructor() {
    super(
      'time_riddle',
      'Time Riddle',
      'The clock faces show different times. Find the pattern...',
      2, // Medium difficulty
      '/images/puzzles/time_riddle.png'
    );

    this.sequence = this.generateTimeSequence();
    this.hints = [
      'Each clock represents a number...',
      'The hands form a mathematical pattern...',
      'Try adding or multiplying the times...'
    ];
  }

  generateTimeSequence() {
    // Generate 3-4 clock times that follow a pattern
    const patterns = [
      // Multiplication pattern (1:00, 2:00, 4:00, 8:00)
      { times: ['1:00', '2:00', '4:00', '8:00'], solution: '16:00' },
      // Addition pattern (2:15, 2:30, 2:45, ?)
      { times: ['2:15', '2:30', '2:45'], solution: '3:00' },
      // Fibonacci in minutes (1:00, 1:01, 1:02, 1:03, ?)
      { times: ['1:00', '1:01', '1:02', '1:03'], solution: '1:05' }
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    this.solution = pattern.solution;
    return pattern.times;
  }

  validateSolution(answer) {
    return answer.toLowerCase() === this.solution.toLowerCase();
  }

  getDescription() {
    return [
      'A series of clock faces materialize in the air...',
      `They show the following times: ${this.sequence.join(' → ')}`,
      'What comes next in the sequence?'
    ].join('\n');
  }
} 