import { Treasure } from '../Treasure';

export class TemporalShard extends Treasure {
  constructor() {
    super(
      'temporal_shard',
      'Temporal Shard',
      'A fragment of crystallized time, holding memories of what once was.',
      'rare',
      {
        type: 'active',
        uses: 1,
        effect: (gameState) => {
          if (gameState.lastAction) {
            return {
              success: true,
              message: 'The shard glows brightly, undoing your last action...',
              effect: () => gameState.undoLastAction()
            };
          }
          return {
            success: false,
            message: 'The shard pulses dimly. There is nothing to undo.'
          };
        },
        description: 'Allows you to undo your last action (consumed on use)'
      }
    );
  }
} 