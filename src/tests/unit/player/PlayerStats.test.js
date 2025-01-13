import fc from 'fast-check';
import { Player } from '../../../mocks/Player';

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
            upgrades.forEach(u => player.addStatBonus(u.type, u.value));
            
            return player.strength <= 1000 &&
                   player.vitality <= 990 &&
                   player.agility <= 1000 &&
                   player.maxHealth <= 10000 &&
                   player.attackPower <= 1000 &&
                   player.defense <= 1000;
          }
        )
      );
    });
  });
}); 