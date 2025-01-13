import { Player } from './mocks/Player';

describe('Memory Upgrades System', () => {
  test('Unlock Memory Upgrades', () => {
    const player = new Player();
    player.upgrades = {};
    
    // Test combat upgrade
    const combatUpgrade = {
      category: 'combat',
      effect: { type: 'strength', value: 5 }
    };
    player.applyUpgrade(combatUpgrade.category, combatUpgrade.effect);
    expect(player.strength).toBe(15); // Base 10 + 5
    
    // Test defense upgrade
    const defenseUpgrade = {
      category: 'defense',
      effect: { type: 'vitality', value: 5 }
    };
    player.applyUpgrade(defenseUpgrade.category, defenseUpgrade.effect);
    expect(player.vitality).toBe(15); // Base 10 + 5
  });
}); 