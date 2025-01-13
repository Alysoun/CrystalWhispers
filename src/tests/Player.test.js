import { Player } from './mocks/Player';

describe('Player System', () => {
  test('Level Up System', () => {
    const player = new Player();
    const initialLevel = player.level;
    player.levelUp();
    expect(player.level).toBe(initialLevel + 1);
    expect(player.maxHealth).toBeGreaterThan(100); // Base health should increase
  });

  test('Experience System', () => {
    const player = new Player();
    const initialExp = player.experience;
    player.gainExperience(50);
    expect(player.experience).toBe(initialExp + 50);
  });

  test('Stats and Effects', () => {
    const player = new Player();
    const initialStrength = player.strength;
    
    player.addEffect('strength', 0.5, 10);
    expect(player.getEffectiveStrength()).toBeGreaterThan(initialStrength);
    
    // Test stat increases
    player.strength += 5;
    player.agility += 5;
    player.vitality += 5;
    player.updateStats();
    
    expect(player.maxHealth).toBeGreaterThan(100);
    expect(player.attackPower).toBeGreaterThan(10);
  });

  test('Upgrade System', () => {
    const player = new Player();
    const upgrade = {
      category: 'combat',
      effect: {
        type: 'strength',
        value: 5
      }
    };
    
    player.applyUpgrade(upgrade.category, upgrade.effect);
    expect(player.upgrades.combat).toBeDefined();
    expect(player.strength).toBeGreaterThan(10);
  });
}); 