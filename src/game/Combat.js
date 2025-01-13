export class CombatSystem {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
  }

  calculateDamage(attacker, defender) {
    const damage = Math.max(1, attacker.attack - defender.defense);
    return damage;
  }
} 