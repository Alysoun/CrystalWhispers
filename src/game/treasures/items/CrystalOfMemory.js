import { Treasure } from '../Treasure';

export class CrystalOfMemory extends Treasure {
  constructor() {
    super(
      'crystal_of_memory',
      'Crystal of Memory',
      'A shimmering crystal that seems to contain fragments of memories.',
      'rare',
      {
        type: 'passive',
        effect: 'Increases memory fragment gains by 25%',
        onFragmentGain: (amount) => Math.floor(amount * 1.25)
      }
    );
  }
} 