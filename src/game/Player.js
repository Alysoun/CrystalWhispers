import { ExpScaling } from './ExpScaling';

export default class Player {
  constructor() {
    this.maxHealth = 50;
    this.health = 50;
    this.attack = 5;
    this.defense = 2;
    this.level = 1;
    this.experience = 0;
    this.healAfterCombat = 0;
  }

  gainExperience(amount) {
    this.experience += amount;
    let levelsGained = 0;
    
    // Use ExpScaling to determine level up requirements
    while (this.experience >= ExpScaling.getExpForNextLevel(this.level)) {
      this.experience -= ExpScaling.getExpForNextLevel(this.level);
      this.level++;
      levelsGained++;
      
      // Level up bonuses
      this.maxHealth += 5;
      this.health = this.maxHealth;
      this.attack += 1;
      this.defense += 1;
    }

    return {
      newLevel: this.level,
      levelsGained,
      remainingExp: this.experience,
      nextLevelExp: ExpScaling.getExpForNextLevel(this.level)
    };
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health;
  }

  isDead() {
    return this.health <= 0;
  }
} 