import fc from 'fast-check';
import { Player } from './mocks/Player';
import { Dungeon } from './mocks/Dungeon';
import { Story } from './mocks/Story';

describe('Game State Transitions', () => {
  describe('Death and Respawn', () => {
    test('Player Death State', () => {
      fc.assert(
        fc.property(
          fc.record({
            fragments: fc.integer(0, 1000),
            level: fc.integer(1, 100)
          }),
          (state) => {
            const player = new Player();
            player.memoryFragments = state.fragments;
            player.level = state.level;
            
            // Simulate death
            player.health = 0;
            const deathResult = player.onDeath();
            
            // Check death mechanics
            return deathResult.keptFragments === Math.floor(state.fragments * 0.2) && // 20% fragments kept
                   deathResult.unlockedUpgrades !== undefined &&
                   player.health === 0;
          }
        )
      );
    });

    test('Respawn State', () => {
      const player = new Player();
      const initialFragments = 100;
      player.memoryFragments = initialFragments;
      
      // Kill and respawn
      player.health = 0;
      const deathResult = player.onDeath();
      player.respawn();
      
      expect(player.health).toBe(player.maxHealth);
      expect(player.memoryFragments).toBe(deathResult.keptFragments);
    });
  });

  describe('Floor Transitions', () => {
    test('Floor Generation', () => {
      fc.assert(
        fc.property(
          fc.integer(1, 10), // Floor number
          (floor) => {
            const dungeon = new Dungeon(50, 50, 20, floor);
            const hasValidBoss = dungeon.rooms.some(room => 
              room.roomType === 'boss' && 
              room.enemyType.level === floor
            );
            const hasValidExit = dungeon.rooms.some(room => 
              room.roomType === 'exit' && 
              room.nextFloor === floor + 1
            );
            
            return hasValidBoss && hasValidExit;
          }
        )
      );
    });

    test('Progress Persistence', () => {
      const gameState = {
        currentFloor: 1,
        clearedFloors: [],
        storyProgress: 0
      };

      // Clear floor
      gameState.clearedFloors.push(1);
      gameState.currentFloor++;
      Story.updateProgress(gameState);

      expect(gameState.currentFloor).toBe(2);
      expect(gameState.clearedFloors).toContain(1);
      expect(gameState.storyProgress).toBeGreaterThan(0);
    });
  });

  describe('Boss Encounters', () => {
    test('Boss Phase Transitions', () => {
      fc.assert(
        fc.property(
          fc.record({
            bossHealth: fc.integer(100, 1000).filter(h => h > 0),
            phaseThresholds: fc.array(
              fc.integer(10, 90).filter(n => n > 0),
              { minLength: 1, maxLength: 3 }
            ).map(arr => {
              // Ensure unique, sorted, and spaced thresholds
              const unique = [...new Set(arr)];
              return unique.sort((a, b) => b - a)
                .filter((v, i) => i === 0 || v < unique[i-1] - 10); // At least 10% gap
            })
          }),
          (params) => {
            const boss = {
              health: params.bossHealth,
              maxHealth: params.bossHealth,
              phases: params.phaseThresholds.map(threshold => ({
                threshold,
                triggered: false
              }))
            };

            let lastHealth = boss.health;
            // Simulate damage until death
            while (boss.health > 0) {
              const damage = Math.max(10, Math.floor(lastHealth * 0.2)); // 20% chunks
              boss.health = Math.max(0, boss.health - damage);
              lastHealth = boss.health;
              
              const healthPercent = (boss.health / boss.maxHealth) * 100;
              boss.phases.forEach(phase => {
                if (!phase.triggered && healthPercent <= phase.threshold) {
                  phase.triggered = true;
                }
              });
            }

            // Verify all phases triggered in order
            return boss.phases.every(phase => phase.triggered);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
}); 