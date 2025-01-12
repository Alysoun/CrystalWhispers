import { Puzzle } from '../Puzzle';

export class TimeRiddle extends Puzzle {
  constructor() {
    super(
      'time_riddle',
      'Time\'s Echo',
      'The clock faces show different times. Find the pattern in their hands...',
      2, // difficulty
      '/images/puzzles/time_riddle.png'
    );

    this.times = this.generateTimes();
    this.solution = this.calculateSolution();
    this.hints = [
      'Look at how the minute hand moves between clocks...',
      'There\'s a mathematical relationship between each step...',
      'The pattern repeats every quarter hour...'
    ];
  }

  generateTimes() {
    const startHour = Math.floor(Math.random() * 12) + 1;
    const startMinute = Math.floor(Math.random() * 60);
    const increment = Math.floor(Math.random() * 3 + 1) * 5; // 5, 10, or 15 minute increments

    return Array(4).fill(0).map((_, i) => {
      const totalMinutes = (startMinute + (increment * i)) % 60;
      const hours = (startHour + Math.floor((startMinute + (increment * i)) / 60)) % 12 || 12;
      return { hours, minutes: totalMinutes };
    });
  }

  calculateSolution() {
    // The next time in the sequence
    const lastTime = this.times[this.times.length - 1];
    const increment = this.times[1].minutes - this.times[0].minutes;
    const nextMinutes = (lastTime.minutes + increment) % 60;
    const nextHours = (lastTime.hours + Math.floor((lastTime.minutes + increment) / 60)) % 12 || 12;
    return `${nextHours}:${nextMinutes.toString().padStart(2, '0')}`;
  }

  checkSolution(answer) {
    this.attempts++;
    const correct = answer === this.solution;
    if (correct) this.solved = true;
    return correct;
  }

  getHint() {
    return this.hints[Math.min(this.attempts, this.hints.length - 1)];
  }

  getDescription() {
    return `${this.description}\n\nYou see four clocks showing these times:\n` +
      this.times.map(t => `${t.hours}:${t.minutes.toString().padStart(2, '0')}`).join(' → ') +
      '\n\nWhat comes next in the sequence?';
  }
} 