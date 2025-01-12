import { Puzzle } from '../Puzzle';

export class MirrorSequence extends Puzzle {
  constructor() {
    super(
      'mirror_sequence',
      'Mirror Sequence',
      'The mirrors await your solution...',
      2,
      '/images/puzzles/mirror_sequence.png'
    );

    this.sequence = this.generateSequence();
    this.hints = [
      'Look for repeating patterns',
      'The sequence follows a mirror-like symmetry',
      'Each wrong answer causes the mirrors to vibrate dangerously...'
    ];
    this.maxAttempts = 3;
  }

  generateSequence() {
    const patterns = ['◇', '○', '□', '△'];
    const length = 5;
    const sequence = [];
    
    // Generate first half
    for (let i = 0; i < length; i++) {
      sequence.push(patterns[Math.floor(Math.random() * patterns.length)]);
    }
    
    // Mirror it
    return [...sequence, ...sequence.reverse()];
  }

  validateSolution(answer) {
    return answer === this.sequence.join('');
  }

  getHint() {
    return [
      this.hints[Math.min(this.attempts, this.hints.length - 1)],
      '\nBe warned: you may only get one chance at this.'
    ].join('');
  }

  getFeature() {
    if (this.destroyed) {
      return 'The mirrors lie shattered, their razor-sharp edges a testament to your failure. Dark energy still crackles around the fragments.';
    }
    if (this.locked) {
      return 'A series of mirrors stands frozen in place, their surfaces clouded and unresponsive. You were lucky they only locked up.';
    }
    return 'A series of mirrors arranged in a mysterious pattern. You can <command>examine puzzle</command> to take a closer look, but be careful - failure could be catastrophic.';
  }

  getDescription() {
    if (this.destroyed) {
      return 'The mirrors have been reduced to dangerous shards. The room bears scorch marks from their violent destruction.';
    }
    if (this.locked) {
      return 'The mirrors are frozen in an eternal stasis, no longer responsive to any input.';
    }
    return [
      `The mirrors show a sequence of symbols: ${this.sequence.join(' ')}`,
      'The air crackles with unstable energy. One wrong move could have dire consequences.',
      'What is your solution?'
    ].join('\n');
  }
} 