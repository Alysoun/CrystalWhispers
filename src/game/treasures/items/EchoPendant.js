import { Treasure } from '../Treasure';

export class EchoPendant extends Treasure {
  constructor() {
    super(
      'echo_pendant',
      'Echo Pendant',
      'A pendant that resonates with echoes of the past.',
      'uncommon',
      {
        type: 'active',
        uses: 3,
        effect: (room) => {
          if (room && room.hasBeenVisited) {
            return {
              success: true,
              message: 'The pendant reveals echoes of your previous visit...',
              effect: () => room.getMemories()
            };
          }
          return {
            success: false,
            message: 'The pendant remains silent. There are no echoes here yet.'
          };
        },
        description: 'Reveals hidden details about previously visited rooms'
      }
    );
  }
} 