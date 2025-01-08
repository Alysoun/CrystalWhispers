import { getRandomInt } from '../utils/helpers';

class FloorTheme {
  constructor(level) {
    this.themes = {
      1: {
        name: 'Prison Level',
        sizes: ['cramped', 'narrow', 'small', 'confined', 'tight', 'claustrophobic', 'restrictive'],
        atmospheres: [
          'dank', 'dark', 'gloomy', 'dim', 'musty', 'stale', 'oppressive', 
          'shadow-filled', 'cold', 'damp'
        ],
        details: [
          'Water drips steadily from the ceiling.',
          'The stone floor is worn smooth by countless footsteps.',
          'Moss grows in the cracks between stones.',
          'The air is thick with the smell of mildew.',
          'Your footsteps echo hollowly.',
          'A chill draft whistles through the chamber.',
          'The walls are slick with condensation.',
          'Tiny vermin scurry in the shadows.',
          'The stones here are stained with age.',
          'Your torch casts dancing shadows on the walls.',
          'The mortar between stones has largely crumbled away.',
          'The ceiling is low and oppressive.'
        ],
        features: [
          'Rusty chains hang from the walls, softly clinking.',
          'Old shackles are bolted to the walls, their locks long since rusted shut.',
          'A moldy prisoner\'s cot rots in the corner, stuffing spilling out.',
          'A broken chamber pot lies in the corner, partially buried in debris.',
          'An iron feeding bowl sits abandoned, kicked into a corner.',
          'A crude stone bench stands against the wall, worn smooth by use.',
          'Faded prisoner tallies are scratched into the walls, telling silent stories.',
          'A pile of moldy straw lies in the corner, rustling softly.',
          'Iron rings are set into the walls at regular intervals.',
          'A rusted grate in the floor leads to darkness below.',
          'Corroded manacles dangle from wall-mounted chains.',
          'A wooden bucket sits beneath a steady drip from the ceiling.'
        ],
        events: [
          'A rat scurries across the floor, disappearing into a crack.',
          'Water drips rhythmically from somewhere in the darkness.',
          'A cold draft carries the distant sound of chains rattling.',
          'Something skitters in the shadows just out of sight.',
          'The torch light flickers, making the shadows dance.',
          'A mournful draft moans through the chamber.',
          'Tiny pebbles occasionally fall from the ceiling.',
          'The sound of dripping water echoes from somewhere nearby.',
          'A distant metallic clang echoes through the corridors.',
          'The shadows seem to shift and move on their own.'
        ],
        featureItems: {
          'Rusty chains hang from the walls': {
            name: 'chains',
            description: 'Heavy iron chains, red with rust. They rattle softly when touched.',
            canTake: false,
            aliases: ['chain', 'rusty chains']
          },
          'Old shackles are bolted to the walls': {
            name: 'shackles',
            description: 'Iron shackles, rusted but still firmly attached to the wall.',
            canTake: false,
            aliases: ['shackle', 'iron shackles']
          },
          'A moldy prisoner\'s cot rots in the corner': {
            name: 'cot',
            description: 'A moldy prison cot, barely holding together. The straw mattress is damp and rotting.',
            canTake: false,
            aliases: ['bed', 'prison cot']
          },
          'A wooden bucket sits beneath a steady drip': {
            name: 'bucket',
            description: 'A wooden bucket, collecting water from the ceiling.',
            canTake: true,
            aliases: ['wooden bucket', 'water bucket']
          },
          'A broken chamber pot lies in the corner': {
            name: 'pot',
            description: 'A crude ceramic pot, cracked and stained with age.',
            canTake: true,
            aliases: ['chamber pot', 'ceramic pot']
          },
          'An iron feeding bowl sits abandoned': {
            name: 'bowl',
            description: 'A shallow iron bowl, dented and rusty.',
            canTake: true,
            aliases: ['feeding bowl', 'iron bowl']
          },
          'A crude stone bench stands against the wall': {
            name: 'bench',
            description: 'A rough stone bench, worn smooth by countless prisoners.',
            canTake: false,
            aliases: ['stone bench']
          },
          'A pile of moldy straw lies in the corner': {
            name: 'straw',
            description: 'A heap of rotting straw that might have served as bedding.',
            canTake: true,
            aliases: ['moldy straw', 'bedding']
          },
          'A rusted grate in the floor': {
            name: 'grate',
            description: 'A heavy iron grate, rusted into the floor. It leads to darkness below.',
            canTake: false,
            aliases: ['floor grate', 'iron grate']
          }
        },
        ambience: [
          'The air is thick with the smell of decay',
          'A distant dripping echoes through the corridors',
          'The stone walls seem to absorb all warmth',
          'Your torch casts wild shadows on the walls',
          'The silence feels almost suffocating',
          'The air tastes of rust and old stone'
        ],
        conditions: [
          'Patches of luminescent mold give off a sickly glow',
          'A thin layer of condensation covers everything',
          'Ancient bloodstains darken the stone floor',
          'The flagstones are slick with moisture',
          'Cobwebs flutter in unseen drafts',
          'The mortar between stones has largely crumbled away'
        ],
        senses: [
          'The musty air fills your lungs with each breath',
          'The cold seeps into your bones',
          'Your footsteps echo strangely in the darkness',
          'The smell of ancient stone and decay surrounds you',
          'The walls feel rough and damp to the touch',
          'The air tastes metallic and stale'
        ]
      },
      2: {
        name: 'Ancient Temple',
        sizes: ['vast', 'ceremonial', 'grand', 'sacred'],
        atmospheres: ['reverent', 'still', 'hushed', 'ethereal'],
        materials: ['marble', 'gilded', 'ornate', 'carved'],
        features: [
          'Broken altar pieces lie scattered about.',
          'Religious symbols adorn the walls.',
          'Ceremonial braziers stand cold and empty.',
          'Ancient prayers are carved into the walls.',
          'The remains of offering bowls litter the floor.',
          'Shattered stained glass crunches underfoot.',
          'Weathered statues of forgotten gods stand watch.',
          'Incense holders hang from tarnished chains.'
        ]
      },
      3: {
        name: 'Crypt Level',
        sizes: ['tomb-like', 'burial', 'catacomb', 'sepulchral'],
        atmospheres: ['deathly quiet', 'stale', 'musty', 'tomb-cold'],
        materials: ['bone-inlaid', 'obsidian', 'ebony', 'death-marked'],
        features: [
          'Ancient bones are stacked in alcoves.',
          'Burial niches line the walls.',
          'Sarcophagus fragments litter the ground.',
          'The air is thick with the dust of ages.',
          'Funeral urns stand in recessed shelves.',
          'Burial wrappings flutter in a ghostly breeze.',
          'Death masks stare from wall mountings.',
          'The floor is inlaid with memorial stones.'
        ]
      },
      4: {
        name: 'Arcane Laboratory',
        sizes: ['circular', 'octagonal', 'strange', 'twisted'],
        atmospheres: ['crackling', 'humming', 'shifting', 'unstable'],
        materials: ['crystal-studded', 'rune-carved', 'enchanted', 'glowing'],
        features: [
          'Broken alchemical apparatus litters workbenches.',
          'Magical residue stains the walls.',
          'Arcane circles are carved into the floor.',
          'Crystal shards pulse with dim light.',
          'The air shimmers with residual magic.',
          'Strange symbols float in the air.',
          'Fractured summoning circles remain visible.',
          'The walls ripple with contained power.'
        ]
      },
      5: {
        name: 'Cosmic Realm',
        sizes: ['vast', 'twisted', 'impossible', 'warped'],
        atmospheres: ['reality-bending', 'star-filled', 'void-touched', 'cosmic'],
        materials: ['starlit', 'void-black', 'constellation-marked', 'cosmic-veined'],
        features: [
          'Reality seems to bend at the corners of your vision.',
          'Stars wheel overhead in impossible patterns.',
          'The walls pulse with cosmic energy.',
          'Geometric shapes float and reconfigure themselves.',
          'Constellations drift across the walls.',
          'The ceiling opens to an infinite void.',
          'Your footsteps echo in impossible ways.',
          'The air tastes of stardust and infinity.',
          'Cosmic winds howl silently.'
        ],
        events: [
          'A shower of starlight briefly illuminates ancient runes.',
          'The air shimmers with otherworldly energy.',
          'Distant stars seem to watch your movements.',
          'Colors shift in ways that shouldn\'t be possible.',
          'Whispers of cosmic secrets echo faintly.',
          'The shadows dance with strange purpose.',
          'Patterns in the walls shift hypnotically.',
          'The air grows thick with swirling stardust.'
        ],
        landmarks: [
          'A massive crystalline formation pulses with cosmic energy.',
          'An ancient alien altar floats silently.',
          'A tear in reality remains stable and fixed.',
          'A pillar of swirling cosmic energy stands firm.',
          'A strange mechanical device hums with power.',
          'An otherworldly archway frames the passage.'
        ]
      }
    };
    this.currentTheme = this.themes[level] || this.themes[1];
  }

  generateRoomDescription() {
    const size = this.getRandomSize();
    const atmosphere = this.getRandomAtmosphere();
    
    // Randomly choose description style
    const style = Math.random();
    
    if (style < 0.3) {
      // Environmental focus
      const ambience = this.currentTheme.ambience[getRandomInt(0, this.currentTheme.ambience.length)];
      const condition = this.currentTheme.conditions[getRandomInt(0, this.currentTheme.conditions.length)];
      return `You're in a ${size} ${atmosphere} chamber. ${ambience}. ${condition}.`;
    } 
    else if (style < 0.6) {
      // Architectural focus
      const detail = this.getRandomDetail();
      return `This ${size} chamber feels ${atmosphere}. ${detail}`;
    }
    else {
      // Sensory focus - fallback to detail if senses aren't available
      if (this.currentTheme.senses) {
        const sense = this.currentTheme.senses[getRandomInt(0, this.currentTheme.senses.length)];
        return `A ${size}, ${atmosphere} space opens before you. ${sense}`;
      } else {
        const detail = this.getRandomDetail();
        return `A ${size}, ${atmosphere} space opens before you. ${detail}`;
      }
    }
  }

  getRandomDetail() {
    return this.currentTheme.details[getRandomInt(0, this.currentTheme.details.length)];
  }

  getRandomEvent() {
    return this.currentTheme.events[getRandomInt(0, this.currentTheme.events.length)];
  }

  getRandomSize() {
    return this.currentTheme.sizes[getRandomInt(0, this.currentTheme.sizes.length)];
  }

  getRandomAtmosphere() {
    return this.currentTheme.atmospheres[getRandomInt(0, this.currentTheme.atmospheres.length)];
  }

  getRandomFeatures(count) {
    const features = new Set();
    while (features.size < count) {
      features.add(this.currentTheme.features[getRandomInt(0, this.currentTheme.features.length)]);
    }
    return Array.from(features);
  }

  getRandomLandmark() {
    if (this.currentTheme.landmarks) {
      return this.currentTheme.landmarks[getRandomInt(0, this.currentTheme.landmarks.length)];
    }
    return null;
  }

  getRandomAmbience() {
    if (this.currentTheme.ambience) {
      return this.currentTheme.ambience[getRandomInt(0, this.currentTheme.ambience.length)];
    }
    return null;
  }
}

class Room {
  constructor(id, x, y, width, height, theme) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.connections = new Map();
    this.items = [];
    this.features = [];
    this.discovered = false;
    this.generated = false;
    this.theme = theme;
    this.isCosmicRealm = theme.currentTheme === theme.themes[5];
    if (this.isCosmicRealm) {
      this.landmark = theme.getRandomLandmark();
    }
    this.lastUpdateTime = Date.now();
    this.updateInterval = 30000; // 30 seconds
    this.updateDescription();
  }

  updateDescription() {
    // Base description changes less frequently
    if (!this.description || Math.random() < 0.1) {
      this.description = this.theme.generateRoomDescription();
    }
    
    // Dynamic elements change more often
    this.currentAmbience = this.theme.getRandomAmbience();
    
    // Events are temporary and change frequently
    if (Math.random() < 0.3) {
      this.currentEvent = this.theme.getRandomEvent();
    } else {
      this.currentEvent = null;
    }

    // Select 1-2 unique features for the room
    this.features = this.theme.getRandomFeatures(getRandomInt(1, 3));

    // Create items based on the new features
    this.createItemsFromFeatures();
  }

  createItemsFromFeatures() {
    // Clear existing feature-based items
    this.items = this.items.filter(item => !item.feature);

    // Get the feature items for the current theme
    const featureItems = this.theme.currentTheme.featureItems;
    if (!featureItems) return;

    // For each feature in the room
    this.features.forEach(feature => {
      // Find matching item definition by checking if the feature text contains the item key
      const itemKey = Object.keys(featureItems).find(key => feature.includes(key));
      if (itemKey) {
        const itemDef = featureItems[itemKey];
        this.items.push({
          ...itemDef,
          feature: feature
        });
      }
    });
  }

  generateDescription() {
    return `You're in a ${this.theme.getRandomSize()} ${this.theme.getRandomAtmosphere()} chamber.`;
  }

  connectTo(otherRoom, direction) {
    // Check if we already have a connection in this direction
    const hasExistingConnection = Array.from(this.connections.values())
      .some(conn => conn.direction === direction);
    
    if (!hasExistingConnection) {
      // Add connection only if we don't already have one in this direction
      this.connections.set(otherRoom.id, {
        room: otherRoom,
        direction: direction,
        state: 'open'
      });

      // Add reverse connection with opposite direction
      const oppositeDirection = {
        'north': 'south',
        'south': 'north',
        'east': 'west',
        'west': 'east'
      }[direction];

      otherRoom.connections.set(this.id, {
        room: this,
        direction: oppositeDirection,
        state: 'open'
      });
    }
  }

  getExits() {
    return Array.from(this.connections.values())
      .map(({ direction, state }) => `${direction} (${state})`)
      .join(', ');
  }

  getFullDescription() {
    // Check if it's time to update
    const now = Date.now();
    if (now - this.lastUpdateTime > this.updateInterval) {
      this.updateDescription();
      this.lastUpdateTime = now;
    }

    let description = this.description;
    
    // Add current ambience if it exists
    if (this.currentAmbience) {
      description += ` ${this.currentAmbience}.`;
    }

    // Add current event if it exists
    if (this.currentEvent) {
      description += ` ${this.currentEvent}`;
    }

    // Filter features to remove ones that mention items we've taken
    let features = this.features.filter(feature => {
      const featureItem = this.items.find(item => feature.includes(item.name));
      return featureItem || !feature.match(/straw|bucket|bowl|pot/); // Add other takeable items here
    });

    // Get all possible item names and aliases from remaining items
    const itemPatterns = this.items.map(item => {
      const patterns = [item.name, ...(item.aliases || [])];
      return `(${patterns.join('|')})`;
    }).join('|');

    // Highlight items in description and features
    if (itemPatterns) {
      const itemRegex = new RegExp(itemPatterns, 'gi');
      description = description.replace(itemRegex, match => `<item>${match}</item>`);
      features = features.map(feature => feature.replace(itemRegex, match => `<item>${match}</item>`));
    }

    // Build the complete description
    let fullDescription = description;

    // Add up to 2 unique features that don't repeat item mentions
    const uniqueFeatures = features
      .filter(feature => !description.toLowerCase().includes(feature.toLowerCase()))
      .slice(0, 2);

    if (uniqueFeatures.length > 0) {
      fullDescription += ` ${uniqueFeatures.join(' ')}`;
    }

    // Add visible items if any remain
    if (this.items.length > 0) {
      const visibleItems = this.items
        .filter(item => !fullDescription.toLowerCase().includes(item.name.toLowerCase()))
        .map(item => `<item>${item.name}</item>`);
      
      if (visibleItems.length > 0) {
        fullDescription += `\nYou also see: ${visibleItems.join(', ')}.`;
      }
    }

    // Add exits
    const exits = this.getExits();
    fullDescription += `\nExits: ${exits}`;

    return fullDescription;
  }

  getCenter() {
    return {
      x: this.x + Math.floor(this.width / 2),
      y: this.y + Math.floor(this.height / 2)
    };
  }

  getAsciiMap() {
    // Larger 11x11 room template
    let ascii = [
      '┌─────────┐',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '│         │',
      '└─────────┘'
    ];

    // Add doors based on connections
    this.connections.forEach(({ direction }) => {
      switch (direction) {
        case 'north':
          ascii[0] = ascii[0].substring(0, 5) + '═' + ascii[0].substring(6);
          break;
        case 'south':
          ascii[10] = ascii[10].substring(0, 5) + '═' + ascii[10].substring(6);
          break;
        case 'east':
          ascii[5] = ascii[5].substring(0, 10) + '║';
          break;
        case 'west':
          ascii[5] = '║' + ascii[5].substring(1);
          break;
      }
    });

    // Theme-specific symbols
    const themeSymbols = {
      'Prison Level': {
        'chains': '⛓',
        'cot': '▭',
        'bench': '═',
        'feeding bowl': 'o',
        default: '·'
      },
      'Ancient Temple': {
        'altar': '†',
        'braziers': 'Ω',
        'statues': '⊥',
        'offering bowls': '○',
        default: '·'
      },
      'Crypt Level': {
        'bones': '☠',
        'urns': '⚱',
        'sarcophagus': '⚰',
        'niches': '□',
        default: '∴'
      },
      'Arcane Laboratory': {
        'apparatus': '⚗',
        'circles': '◎',
        'crystals': '♦',
        'symbols': '※',
        default: '⁂'
      },
      'Cosmic Realm': {
        'altar': '✧',
        'void': '✫',
        'shapes': '❖',
        'energy': '✺',
        default: '⋆'
      }
    };

    // Place features in ASCII map with better spacing
    const usedPositions = new Set();

    this.items.forEach(item => {
      const symbols = themeSymbols[this.theme.currentTheme.name] || themeSymbols['Prison Level'];
      // Use the item's name to look up the symbol
      const symbol = symbols[item.name] || symbols.default;
      
      // Try to find an unused position
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 20) {
        const row = getRandomInt(1, 10);
        const col = getRandomInt(1, 9);
        const position = `${row},${col}`;
        
        if (!usedPositions.has(position)) {
          usedPositions.add(position);
          ascii[row] = ascii[row].substring(0, col) + symbol + ascii[row].substring(col + 1);
          placed = true;
        }
        attempts++;
      }
    });

    // For cosmic realm, fill empty spaces more sparsely
    if (this.isCosmicRealm) {
      for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 9; j++) {
          const position = `${i},${j}`;
          if (!usedPositions.has(position) && Math.random() < 0.3) { // 30% chance to add cosmic effect
            const cosmicSymbols = ['✧', '✦', '⋆', '✫', '·'];
            ascii[i] = ascii[i].substring(0, j) + 
                      cosmicSymbols[getRandomInt(0, cosmicSymbols.length)] + 
                      ascii[i].substring(j + 1);
          }
        }
      }
    }

    return ascii.join('\n');
  }

  discover() {
    if (!this.discovered) {
      this.discovered = true;
      if (!this.generated) {
        this.generateContent();
        this.generated = true;
      }
    }
  }

  generateContent() {
    this.updateDescription();
    this.createItemsFromFeatures();
  }
}

class Dungeon {
  constructor(width, height, numRooms, level = 1) {
    this.width = width;
    this.height = height;
    this.numRooms = numRooms;
    this.level = level;
    this.rooms = new Map();
    this.currentRoomId = 0;
    this.theme = this.generateTheme();
    this.generateDungeon();
  }

  generateTheme() {
    return new FloorTheme(this.level);
  }

  generateDungeon() {
    // Create the starting room in the center
    const centerX = Math.floor(this.width / 2);
    const centerY = Math.floor(this.height / 2);
    const ROOM_SIZE = 5;
    const startRoom = new Room(0, centerX, centerY, ROOM_SIZE, ROOM_SIZE, this.theme);
    this.rooms.set(0, startRoom);

    // Generate additional rooms
    for (let i = 1; i < this.numRooms; i++) {
      this.addAdjacentRoom(i, ROOM_SIZE);
    }

    // Add extra connections for variety
    this.connectRooms();
    this.addExtraConnections();
  }

  addAdjacentRoom(id, roomSize) {
    // Pick a random existing room to branch from
    const existingRooms = Array.from(this.rooms.values());
    const parentRoom = existingRooms[Math.floor(Math.random() * existingRooms.length)];

    // Room spacing should be roomSize + 1 for corridors
    const ROOM_SPACING = roomSize + 1;
    
    const directions = [
      { dx: 1, dy: 0, dir: 'east' },
      { dx: -1, dy: 0, dir: 'west' },
      { dx: 0, dy: 1, dir: 'south' },
      { dx: 0, dy: -1, dir: 'north' }
    ].sort(() => Math.random() - 0.5);

    for (const { dx, dy, dir } of directions) {
      const newX = parentRoom.x + (dx * ROOM_SPACING);
      const newY = parentRoom.y + (dy * ROOM_SPACING);

      if (this.isValidPosition(newX, newY, roomSize) && !this.hasOverlap(newX, newY, roomSize)) {
        const newRoom = new Room(id, newX, newY, roomSize, roomSize, this.theme);
        this.rooms.set(id, newRoom);
        parentRoom.connectTo(newRoom, dir);
        return;
      }
    }

    // If we couldn't place the room, try again with a different parent
    if (existingRooms.length > 1) {
      this.addAdjacentRoom(id, roomSize);
    }
  }

  isValidPosition(x, y, size) {
    return x >= 0 && x + size <= this.width && y >= 0 && y + size <= this.height;
  }

  hasOverlap(x, y, size) {
    const BUFFER = 1;
    return Array.from(this.rooms.values()).some(room => {
      return !(x + size + BUFFER <= room.x || 
               x >= room.x + room.width + BUFFER ||
               y + size + BUFFER <= room.y || 
               y >= room.y + room.height + BUFFER);
    });
  }

  connectRooms() {
    const unconnected = new Set(this.rooms.keys());
    const connected = new Set([0]);
    unconnected.delete(0);

    while (unconnected.size > 0) {
      let minDistance = Infinity;
      let bestPair = null;
      let bestDirection = null;

      for (let connectedId of connected) {
        for (let unconnectedId of unconnected) {
          const distance = this.getRoomDistance(
            this.rooms.get(connectedId),
            this.rooms.get(unconnectedId)
          );
          if (distance < minDistance) {
            minDistance = distance;
            bestPair = [connectedId, unconnectedId];
            bestDirection = this.getDirection(
              this.rooms.get(connectedId),
              this.rooms.get(unconnectedId)
            );
          }
        }
      }

      if (bestPair && bestDirection) {
        const [roomAId, roomBId] = bestPair;
        this.rooms.get(roomAId).connectTo(this.rooms.get(roomBId), bestDirection);
        connected.add(roomBId);
        unconnected.delete(roomBId);
      }
    }
  }

  getRoomDistance(roomA, roomB) {
    const centerA = roomA.getCenter();
    const centerB = roomB.getCenter();
    return Math.abs(centerA.x - centerB.x) + Math.abs(centerA.y - centerB.y);
  }

  getDirection(roomA, roomB) {
    const centerA = roomA.getCenter();
    const centerB = roomB.getCenter();
    
    const dx = centerB.x - centerA.x;
    const dy = centerB.y - centerA.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'east' : 'west';
    } else {
      return dy > 0 ? 'south' : 'north';
    }
  }

  addExtraConnections() {
    const EXTRA_CONNECTIONS = 3;
    const roomIds = Array.from(this.rooms.keys());
    
    for (let i = 0; i < EXTRA_CONNECTIONS; i++) {
      const roomAId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const roomBId = roomIds[Math.floor(Math.random() * roomIds.length)];
      const roomA = this.rooms.get(roomAId);
      const roomB = this.rooms.get(roomBId);
      
      if (roomAId !== roomBId && !roomA.connections.has(roomBId)) {
        const direction = this.getDirection(roomA, roomB);
        roomA.connectTo(roomB, direction);
      }
    }
  }

  getCurrentRoom() {
    return this.rooms.get(this.currentRoomId);
  }
}

export { Dungeon, Room }; 