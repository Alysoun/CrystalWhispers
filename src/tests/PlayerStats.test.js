import fc from 'fast-check';
import { Player } from './mocks/Player';

describe('Player Stats System', () => {
  describe('Stat Scaling', () => {
    test('Stat Increases Are Bounded', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constantFrom('strength', 'vitality', 'agility'),
              value: fc.nat(1000).map(n => n + 1)
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (upgrades) => {
            const player = new Player();
            upgrades.sort((a, b) => b.value - a.value)
                    .forEach(u => player.addStatBonus(u.type, u.value));
            
            // Verify each stat is within its bounds
            const validStrength = player.strength <= 1000;
            const validVitality = player.vitality <= 990; // Lower cap for vitality
            const validAgility = player.agility <= 1000;
            const validHealth = player.maxHealth <= 10000;
            const validAttack = player.attackPower <= 1000;
            const validDefense = player.defense <= 1000;

            return validStrength && validVitality && validAgility && 
                   validHealth && validAttack && validDefense;
          }
        ),
        { numRuns: 1000 } // Increase test runs to catch edge cases
      );
    });

    test('Derived Stats Scale Correctly', () => {
      fc.assert(
        fc.property(
          fc.record({
            strength: fc.integer(10, 100),
            vitality: fc.integer(10, 100),
            agility: fc.integer(10, 100)
          }),
          (stats) => {
            const player = new Player();
            player.strength = stats.strength;
            player.vitality = stats.vitality;
            player.agility = stats.agility;
            player.updateStats();

            // Calculate expected values with caps
            const expectedHealth = 100 + Math.min(stats.vitality * 10, 9900);
            const expectedAttack = 10 + Math.min(stats.strength * 2, 990);
            const expectedDefense = 5 + Math.min(stats.agility * 1.5, 995);

            return player.maxHealth === expectedHealth &&
                   player.attackPower === expectedAttack &&
                   player.defense === expectedDefense;
          }
        )
      );
    });
  });

  describe('Combat Stats', () => {
    test('Effective Combat Values', () => {
      fc.assert(
        fc.property(
          fc.record({
            baseAttack: fc.integer(10, 100),
            enemyDefense: fc.nat(50)
          }),
          (params) => {
            const player = new Player();
            player.attackPower = Math.max(10, params.baseAttack);
            
            const enemy = {
              health: 100,
              defense: params.enemyDefense
            };

            const result = player.attack(enemy);
            // Damage should be at least 1 but not more than attack
            return result.damage >= 1 && 
                   result.damage <= player.attackPower;
          }
        )
      );
    });
  });

  describe('Level Up System', () => {
    test('Level Up Bonuses', () => {
      fc.assert(
        fc.property(
          fc.nat(10).map(n => n + 1), // Natural number from 1-10
          (levels) => {
            const player = new Player();
            const initialHealth = player.maxHealth;
            
            for (let i = 0; i < levels; i++) {
              player.levelUp();
            }

            return player.level === levels + 1 && 
                   player.maxHealth === initialHealth + (20 * levels);
          }
        )
      );
    });
  });

  describe('Status Effects', () => {
    test('Temporary Stat Boosts', () => {
      fc.assert(
        fc.property(
          fc.record({
            effectType: fc.constantFrom('strength', 'defense', 'agility'),
            value: fc.integer(1, 50),
            duration: fc.integer(1, 10)
          }),
          (effect) => {
            const player = new Player();
            const initialValue = player[effect.effectType];
            
            player.addEffect(effect.effectType, effect.value, effect.duration);
            
            // Get the correct boosted value based on effect type
            const boostedValue = effect.effectType === 'strength' 
              ? player.getEffectiveStrength()
              : effect.effectType === 'defense'
              ? player.getEffectiveDefense()
              : player.getEffectiveAgility();

            return boostedValue === initialValue + effect.value;
          }
        )
      );
    });
  });
}); 