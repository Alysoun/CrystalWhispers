export class Potion {
  constructor(type) {
    this.type = type;
    switch(type) {
      case 'health':
        this.name = 'Health Potion';
        this.description = 'Restores 25 HP';
        this.effect = (player) => {
          const healAmount = 25;
          player.health = Math.min(player.maxHealth, player.health + healAmount);
          return `Restored ${healAmount} HP`;
        };
        break;
      case 'strength':
        this.name = 'Strength Potion';
        this.description = 'Temporarily increases attack by 5';
        this.effect = (player) => {
          player.temporaryEffects = player.temporaryEffects || {};
          player.temporaryEffects.attackBonus = (player.temporaryEffects.attackBonus || 0) + 5;
          player.temporaryEffects.duration = 3;
          return 'Attack increased by 5 for 3 turns';
        };
        break;
      case 'defense':
        this.name = 'Defense Potion';
        this.description = 'Temporarily increases defense by 3';
        this.effect = (player) => {
          player.temporaryEffects = player.temporaryEffects || {};
          player.temporaryEffects.defenseBonus = (player.temporaryEffects.defenseBonus || 0) + 3;
          player.temporaryEffects.duration = 3;
          return 'Defense increased by 3 for 3 turns';
        };
        break;
    }
  }
} 