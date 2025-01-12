export class Puzzle {
  constructor(id, name, description, difficulty, imageUrl) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.difficulty = difficulty;
    this.imageUrl = imageUrl;
    this.solved = false;
    this.attempts = 0;
    this.destroyed = false;
    this.maxAttempts = 2; // Two attempts total: one failure allowed
  }

  getDescription() {
    return this.description;
  }

  getFeature() {
    // Can be overridden by specific puzzles to add room features
    return null;
  }

  checkSolution(answer, player) {
    this.attempts++;
    const correct = this.validateSolution(answer);
    
    if (correct) {
      this.solved = true;
      return {
        success: true,
        message: "That's correct! The puzzle resonates with a satisfying hum.",
        reward: this.getReward()
      };
    } else if (this.attempts < this.maxAttempts) {
      // First failure - warning
      const damage = Math.floor(this.difficulty * 5);
      player.health = Math.max(0, player.health - damage);
      return {
        success: false,
        message: [
          "Wrong solution! The puzzle destabilizes momentarily.",
          `You take ${damage} damage from the magical backlash.`,
          "The puzzle might not survive another failed attempt..."
        ].join('\n'),
        damage,
        destroyed: false
      };
    } else {
      // Second failure - destruction
      const damage = Math.floor(this.difficulty * 20);
      player.health = Math.max(0, player.health - damage);
      this.destroyed = true;
      return {
        success: false,
        message: [
          "The puzzle violently destabilizes!",
          `You take ${damage} damage as magical energy explodes outward.`,
          "The room's features are permanently scarred by the destruction."
        ].join('\n'),
        damage,
        destroyed: true
      };
    }
  }

  validateSolution(answer) {
    throw new Error('validateSolution must be implemented by puzzle');
  }

  getHint() {
    throw new Error('getHint must be implemented by puzzle');
  }

  getReward() {
    const baseReward = this.difficulty * 10;
    const attemptPenalty = Math.max(0, this.attempts - 1) * 5;
    return Math.max(5, baseReward - attemptPenalty);
  }
} 