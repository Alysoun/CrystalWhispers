import { Treasure } from '../Treasure';

export class MemoryVessel extends Treasure {
  constructor() {
    super(
      'memory_vessel',
      'Memory Vessel',
      'A container that seems designed to hold memories themselves.',
      'epic',
      {
        type: 'active',
        uses: -1, // Infinite uses
        effect: (fragments) => {
          if (fragments > 0) {
            return {
              success: true,
              message: 'The vessel stores your memory fragments for safekeeping...',
              effect: () => ({
                storedFragments: fragments,
                onDeath: (player) => {
                  player.memoryFragments += Math.floor(fragments * 0.5);
                  return `The Memory Vessel preserved ${Math.floor(fragments * 0.5)} fragments through death.`;
                }
              })
            };
          }
          return {
            success: false,
            message: 'The vessel cannot store what you do not have.'
          };
        },
        description: 'Preserves 50% of your memory fragments through death'
      }
    );
  }
} 