import fc from 'fast-check';
import { MemoryCrystal, calculateFragmentGain } from '../game/MemoryCrystal';

describe('Memory Crystal System', () => {
  test('Fragment Gains Scale With Level', () => {
    fc.assert(
      fc.property(
        fc.record({
          level: fc.integer(1, 100),
          baseAmount: fc.nat(1000)
        }),
        (params) => {
          const lowerLevelGain = calculateFragmentGain(params.level, params.baseAmount);
          const higherLevelGain = calculateFragmentGain(params.level + 1, params.baseAmount);
          return higherLevelGain >= lowerLevelGain;
        }
      )
    );
  });

  test('Fragment Gains Are Never Negative', () => {
    fc.assert(
      fc.property(
        fc.record({
          level: fc.integer(),
          baseAmount: fc.integer()
        }),
        (params) => {
          const gain = calculateFragmentGain(params.level, params.baseAmount);
          return gain >= 0;
        }
      )
    );
  });

  test('Zero Base Amount Results In Zero Gain', () => {
    fc.assert(
      fc.property(
        fc.integer(1, 100),
        (level) => {
          const gain = calculateFragmentGain(level, 0);
          return gain === 0;
        }
      )
    );
  });

  describe('Crystal Stacking', () => {
    test('Crystal Effects Stack Correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom('DEFIANCE', 'RESILIENCE', 'REFLECTION', 'CHALLENGE'),
            { minLength: 1, maxLength: 10 }
          ),
          (crystals) => {
            const mods = MemoryCrystal.calculateModifiers(crystals);
            // Effects should always increase with more crystals
            return mods.enemyHealth >= 1 && 
                   mods.enemyDamage >= 1 && 
                   mods.lootQuality >= 1;
          }
        )
      );
    });

    test('Boss Modification', () => {
      const baseBoss = {
        health: 100,
        maxHealth: 100,
        attack: 10,
        phases: [{ activeAbilities: ['ability1'] }],
        specialAbilities: {
          ability1: {},
          ability2: {},
          ability3: {}
        }
      };

      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom('DEFIANCE'),
            { minLength: 1, maxLength: 3 }
          ),
          (crystals) => {
            const modifiedBoss = MemoryCrystal.modifyBoss(baseBoss, crystals);
            return modifiedBoss.health > baseBoss.health &&
                   modifiedBoss.attack > baseBoss.attack;
          }
        )
      );
    });
  });

  describe('Crystal Availability', () => {
    test('Crystals Unlock Progressively', () => {
      expect(MemoryCrystal.getAvailableCrystals(0)).toHaveLength(0);
      expect(MemoryCrystal.getAvailableCrystals(1)).toContain('DEFIANCE');
      expect(MemoryCrystal.getAvailableCrystals(2)).toContain('RESILIENCE');
      expect(MemoryCrystal.getAvailableCrystals(3)).toContain('REFLECTION');
      expect(MemoryCrystal.getAvailableCrystals(5)).toContain('CHALLENGE');
    });

    test('Crystal Effects Are Valid', () => {
      Object.entries(MemoryCrystal.types).forEach(([type, crystal]) => {
        fc.assert(
          fc.property(
            fc.nat(5), // Use nat() for non-negative integers, max 5
            (count) => {
              const effect = crystal.effect(count + 1); // Ensure at least 1
              // All effects should be numbers and >= their base values
              return Object.values(effect).every(v => 
                typeof v === 'number' && v >= (v > 1 ? 1 : 0)
              );
            }
          )
        );
      });
    });
  });

  describe('Edge Cases', () => {
    test('Handles Invalid Crystal Types', () => {
      const mods = MemoryCrystal.calculateModifiers(['INVALID_TYPE']);
      expect(mods.enemyHealth).toBe(1); // Should return base values
      expect(mods.enemyDamage).toBe(1);
    });

    test('Handles Empty Crystal Array', () => {
      const mods = MemoryCrystal.calculateModifiers([]);
      expect(mods.enemyHealth).toBe(1);
      expect(mods.enemyDamage).toBe(1);
    });

    test('Prevents Infinite Scaling', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.constantFrom('DEFIANCE'),
            { minLength: 10, maxLength: 100 }
          ),
          (crystals) => {
            const mods = MemoryCrystal.calculateModifiers(crystals);
            // Should have some reasonable upper limit
            return mods.enemyHealth < 1000 && mods.enemyDamage < 1000;
          }
        )
      );
    });
  });
}); 