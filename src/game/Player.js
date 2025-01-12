import { ExpScaling } from './ExpScaling';
import { MemoryCrystal } from './MemoryCrystal';

export default class Player {
  constructor() {
    // Base stats
    this.level = 1;
    this.experience = 0;
    this.experienceToNext = 100;
    
    // Core stats
    this.strength = 10;
    this.agility = 10;
    this.vitality = 10;
    
    // Derived stats
    this.maxHealth = 100;
    this.health = 100;
    this.attackPower = 10;
    this.defense = 5;
    
    // Effects and upgrades
    this.effects = new Map();
    this.upgrades = {};

    this.updateStats();
  }

  updateStats() {
    // Update derived stats based on core stats and level
    this.maxHealth = this.vitality * 10;
    this.attackPower = this.strength * 2;
    this.defense = this.agility + 5;
    
    // Cap health at new max
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }

  gainExperience(amount) {
    this.experience += amount;
    const expNeeded = this.level * 100;
    
    // Level up if enough experience
    while (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level += 1;
    this.maxHealth += 20;
    this.health = this.maxHealth;  // Heal on level up
    this.attackPower += 2;
    this.defense += 2;
    this.experience -= (this.level - 1) * 100;  // Subtract exp needed for previous level
  }

  addEffect(type, magnitude, duration) {
    this.effects.set(type, {
      magnitude,
      duration,
      remaining: duration
    });
  }

  removeEffect(type) {
    this.effects.delete(type);
  }

  updateEffects() {
    for (const [type, effect] of this.effects.entries()) {
      effect.remaining--;
      if (effect.remaining <= 0) {
        this.effects.delete(type);
      }
    }
  }

  getEffectBonus(type) {
    const effect = this.effects.get(type);
    return effect ? effect.magnitude : 0;
  }

  getTotalAttack() {
    return this.attackPower * (1 + this.getEffectBonus('strength'));
  }

  getTotalDefense() {
    return this.defense * (1 + this.getEffectBonus('defense'));
  }
} 