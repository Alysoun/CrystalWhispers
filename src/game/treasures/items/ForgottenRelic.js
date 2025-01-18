import { Treasure } from '../Treasure';

export class ForgottenRelic extends Treasure {
  constructor() {
    super(
      'forgotten_relic',
      'Forgotten Relic',
      'An ancient artifact of unknown origin, its purpose lost to time.',
      'legendary',
      {
        type: 'active',
        uses: 1,
        effect: (trap) => {
          if (trap) {
            return {
              success: true,
              message: 'The relic pulses with ancient power, disarming the trap...',
              effect: () => trap.disarm()
            };
          }
          return {
            success: false,
            message: 'The relic remains dormant. There are no traps nearby.'
          };
        },
        description: 'Automatically disarms any trap (consumed on use)'
      }
    );
  }
} 