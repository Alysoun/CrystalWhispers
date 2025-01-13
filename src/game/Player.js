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
    this.potions = this.potions || [];
    this.temporaryEffects = {};
    this.upgrades = this.upgrades || {};
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

  getPotionCapacity() {
    const potionBeltLevel = this.upgrades?.survival?.potionBelt || 0;
    return 2 + potionBeltLevel; // Base 2 slots + 1 per level
  }

  addPotion(potion) {
    if (this.potions.length < this.getPotionCapacity()) {
      this.potions.push(potion);
      return true;
    }
    return false;
  }

  usePotion(index) {
    if (index >= 0 && index < this.potions.length) {
      const potion = this.potions[index];
      const message = potion.effect(this);
      this.potions.splice(index, 1);
      return { success: true, message };
    }
    return { success: false, message: "No potion in that slot" };
  }

  updateEffects() {
    if (this.temporaryEffects.duration > 0) {
      this.temporaryEffects.duration--;
      if (this.temporaryEffects.duration === 0) {
        this.temporaryEffects = {};
      }
    }
  }

  getTotalAttack() {
    return this.attack + (this.temporaryEffects.attackBonus || 0);
  }

  getTotalDefense() {
    return this.defense + (this.temporaryEffects.defenseBonus || 0);
  }
} 