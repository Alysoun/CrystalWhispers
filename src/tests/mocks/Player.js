export class Player {
  constructor() {
    this.health = 100;
    this.maxHealth = 100;
    this.memoryFragments = 0;
    this.attackPower = 10;
    this.defense = 5;
    this.level = 1;
    this.experience = 0;
    this.strength = 10;
    this.agility = 10;
    this.vitality = 10;
    this.effects = new Map();
    this.upgrades = {};
    this.statBonuses = {
      strength: 0,
      vitality: 0,
      agility: 0
    };
  }

  levelUp() {
    this.level++;
    this.maxHealth += 20;
    this.health = this.maxHealth;
  }

  gainExperience(amount) {
    this.experience += amount;
    if (this.experience >= 100) {
      this.levelUp();
      this.experience -= 100;
    }
  }

  addEffect(type, value, duration) {
    this.effects.set(type, { value, duration });
  }

  getEffectiveStrength() {
    let total = this.strength;
    if (this.effects.has('strength')) {
      total += this.effects.get('strength').value;
    }
    return total;
  }

  getEffectiveDefense() {
    let total = this.defense;
    if (this.effects.has('defense')) {
      total += this.effects.get('defense').value;
    }
    return total;
  }

  getEffectiveAgility() {
    let total = this.agility;
    if (this.effects.has('agility')) {
      total += this.effects.get('agility').value;
    }
    return total;
  }

  updateStats() {
    const vitalityBonus = Math.min(this.vitality * 10, 9900);
    this.maxHealth = 100 + vitalityBonus;
    
    this.attackPower = 10 + Math.min(this.strength * 2, 990);
    this.defense = 5 + Math.min(this.agility * 1.5, 995);
  }

  applyUpgrade(category, effect) {
    if (!this.upgrades[category]) {
      this.upgrades[category] = [];
    }
    this.upgrades[category].push(effect);
    
    if (effect.type === 'strength') {
      this.strength += effect.value;
    } else if (effect.type === 'vitality') {
      this.vitality += effect.value;
    }
    
    this.updateStats();
  }

  addMemoryFragments(amount) {
    this.memoryFragments += amount;
  }

  attack(enemy) {
    const damage = Math.max(1, Math.max(10, this.attackPower) - Math.max(0, enemy.defense));
    enemy.health -= damage;
    return { damage };
  }

  onDeath() {
    const keptFragments = Math.floor(this.memoryFragments * 0.2);
    return {
      keptFragments,
      unlockedUpgrades: {}
    };
  }

  takeItem(item, room) {
    return room.removeItem(item);
  }

  unlockStat(statName, gameState) {
    if (gameState.unlockedStats) {
      gameState.unlockedStats[statName] = true;
    }
  }

  addStatBonus(type, value) {
    if (this.statBonuses[type] !== undefined && value > 0) {
      const currentBonus = this.statBonuses[type];
      const newBonus = Math.min(value, 1000) / (1 + (currentBonus * 0.1));
      this.statBonuses[type] += newBonus;
      
      const maxBaseStat = type === 'vitality' ? 990 : 1000;
      this[type] = Math.min(maxBaseStat, Math.floor(10 + this.statBonuses[type]));
      this.updateStats();
    }
  }

  respawn() {
    this.health = this.maxHealth;
    this.memoryFragments = Math.floor(this.memoryFragments * 0.2);
  }
} 