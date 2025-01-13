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
    
    // Check for level up
    const expNeeded = ExpScaling.getExpForNextLevel(this.level);
    if (this.experience >= expNeeded) {
      this.levelUp();
    }
    
    return {
      currentExp: this.experience,
      expNeeded,
      didLevelUp: this.experience >= expNeeded
    };
  }

  levelUp() {
    this.level++;
    this.maxHealth += 10;
    this.health = this.maxHealth; // Heal on level up
    this.attackPower += 2;
    this.defense += 1;
    
    // Reset experience to remainder
    const prevLevelExp = ExpScaling.getExpForNextLevel(this.level - 1);
    this.experience -= prevLevelExp;
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

  applyUpgrade(category, effect) {
    this.upgrades[category] = this.upgrades[category] || {};
    Object.entries(effect).forEach(([stat, value]) => {
      switch(stat) {
        case 'maxHealth':
          this.maxHealth += value;
          this.health = this.maxHealth;
          break;
        case 'attackPower':
          this.attackPower += value;
          break;
        case 'defense':
          this.defense += value;
          break;
        default:
          this.upgrades[category][stat] = (this.upgrades[category][stat] || 0) + value;
      }
    });
  }
} 