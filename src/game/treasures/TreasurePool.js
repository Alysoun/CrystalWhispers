import { AntiqueWatch } from './items/AntiqueWatch';
import { BrokenMirror } from './items/BrokenMirror';
import { ChildsLocket } from './items/ChildsLocket';
import { OldDiary } from './items/OldDiary';
import { MusicBox } from './items/MusicBox';
// import { AcceptanceToken } from './items/AcceptanceToken';
import { CrystalOfMemory } from './items/CrystalOfMemory';
// import { EchoingPendant } from './items/EchoPendant';
import { TemporalShard } from './items/TemporalShard';
import { ForgottenRelic } from './items/ForgottenRelic';
import { MemoryVessel } from './items/MemoryVessel';

export class TreasurePool {
  constructor() {
    this.allTreasures = new Map();
    this.discoveredTreasures = new Set();
    this.initializeTreasures();
  }

  initializeTreasures() {
    // Add all possible treasures to the pool
    [
      new AntiqueWatch(),
      new BrokenMirror(),
      new ChildsLocket(),
      new OldDiary(),
      new MusicBox(),
     // new AcceptanceToken(),
      new CrystalOfMemory(),
      // new EchoingPendant(),
      new TemporalShard(),
      new ForgottenRelic(),
      new MemoryVessel()

    ].forEach(treasure => {
      this.allTreasures.set(treasure.id, treasure);
    });
  }

  getRandomTreasure(rarity = null) {
    const availableTreasures = Array.from(this.allTreasures.values())
      .filter(t => rarity ? t.rarity === rarity : true);
    
    return availableTreasures[Math.floor(Math.random() * availableTreasures.length)];
  }

  // Get a selection of treasures for run start
  getStartingSelection(count = 3) {
    const discovered = Array.from(this.discoveredTreasures);
    if (discovered.length < count) {
      return [...discovered, ...Array(count - discovered.length)
        .fill()
        .map(() => this.getRandomTreasure())];
    }

    // Rotate through discovered treasures to ensure variety
    const selection = [];
    const lastSelected = this.lastSelectedTreasures || new Set();

    while (selection.length < count) {
      const potential = discovered[Math.floor(Math.random() * discovered.length)];
      if (!lastSelected.has(potential.id)) {
        selection.push(potential);
        lastSelected.add(potential.id);
      }
    }

    // Keep track of what was offered this time
    this.lastSelectedTreasures = new Set(selection.map(t => t.id));
    return selection;
  }

  discoverTreasure(treasureId) {
    const treasure = this.allTreasures.get(treasureId);
    if (treasure && !treasure.discovered) {
      treasure.discovered = true;
      this.discoveredTreasures.add(treasure);
    }
  }
} 