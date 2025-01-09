import { getRandomInt } from '../utils/helpers';

class FloorTheme {
  constructor(level) {
    this.themes = {
      1: {
        name: 'Forgotten Halls',
        sizes: ['familiar', 'preserved', 'unchanging', 'dreamlike', 'mirror-filled'],
        atmospheres: [
          'strangely comfortable', 'hazily remembered', 'oddly peaceful', 
          'seemingly frozen', 'timelessly still', 'eerily familiar'
        ],
        details: [
          'Mirrors reflect scenes that feel like memories.',
          'Time seems to flow differently here.',
          'Everything feels exactly as you remember it.',
          'The walls shift subtly when you look away.',
          'Echoes of laughter fade just as you notice them.',
          'Light filters through windows that shouldn\'t exist.'
        ],
        features: [
          'A familiar chair sits in an impossible corner.',
          'A table is set for guests who will never arrive.',
          'Family portraits hang on walls that shouldn\'t be here.',
          'Mirrors reflect versions of the room that can\'t exist.',
          'A music box sits on a shelf, its melody just out of reach.',
          'An old photograph floats impossibly in mid-air.',
          'A leather-bound journal rests on a side table.',
          'A pocket watch hangs from a hook, ticking backwards.',
          'A child\'s toy lies forgotten in a corner.',
          'Windows look out on memories rather than views.',
          'A perfectly preserved scene stands frozen in time.',
          'Shelves hold books that write themselves.',
          'A grandfather clock shows impossible hours.',
          'A tea set steams with an eternal brew.'
        ],
        events: [
          'A memory flickers at the edge of your vision.',
          'The sound of familiar laughter echoes distantly.',
          'Shadows of people who aren\'t there dance across the walls.',
          'Time seems to skip like a broken record.',
          'The room briefly appears as it once was.',
          'A door opens to somewhere that can\'t exist.'
        ],
        ambience: [
          'The air feels thick with forgotten memories',
          'Time moves strangely here, like honey dripping',
          'Everything seems frozen in a perfect moment',
          'The walls hold echoes of what once was',
          'Reality feels thin, like tissue paper',
          'The past and present blur together'
        ],
        conditions: [
          'The room maintains an impossible perfection',
          'Everything is exactly as you remember it',
          'Time seems to loop in small ways',
          'The space defies natural decay',
          'Reality bends to preserve what was',
          'Nothing here changes, no matter what'
        ],
        senses: [
          'The air tastes like childhood memories',
          'Everything feels eerily familiar',
          'Sounds echo as if from long ago',
          'The light has an unnatural permanence',
          'Time feels frozen in amber',
          'Your memories seem more real than reality'
        ],
        featureItems: {
          'A perfectly preserved scene stands frozen in time': {
            name: 'memory crystal',
            description: 'A delicate crystal sphere that seems to capture a moment in time. Within its depths, you see fleeting images of happiness.',
            canTake: true,
            aliases: ['crystal', 'preserved crystal', 'sphere'],
            examine: 'The crystal shows different scenes each time you look: a family dinner, children playing, someone reading by firelight. The images feel achingly familiar.'
          },
          'Family portraits hang on walls': {
            name: 'portrait',
            description: 'A family portrait whose subjects seem to shift when viewed from different angles.',
            canTake: false,
            aliases: ['painting', 'family portrait', 'picture'],
            examine: 'The faces in the portrait are blurred, yet somehow familiar. They seem to change expressions when you look away.'
          },
          'chair': {
            name: 'chair',
            description: 'A comfortable-looking armchair that seems to belong to another time and place.',
            canTake: false,
            aliases: ['armchair', 'comfortable chair', 'rocking chair'],
            examine: 'The chair feels warm, as if someone just stood up from it. You recognize it, but can\'t quite place from where.'
          },
          'mirror': {
            name: 'mirror',
            description: 'An ornate mirror that shows impossible reflections.',
            canTake: false,
            aliases: ['looking glass', 'reflection'],
            examine: 'In the mirror, the room appears different - warmer, lived-in, full of life. For a moment, you see someone familiar in the reflection.'
          },
          'A table is set for guests': {
            name: 'place setting',
            description: 'Fine china and silverware, perfectly arranged, gathering no dust.',
            canTake: true,
            aliases: ['dishes', 'silverware', 'china'],
            examine: 'The plates are still warm, as if dinner was just served. You recognize the pattern on the china from somewhere...'
          },
          'A music box sits on a shelf': {
            name: 'music box',
            description: 'A delicate wooden box with a brass key.',
            canTake: true,
            aliases: ['box', 'wooden box'],
            examine: 'When wound, it plays a melody you\'ve known all your life, though you can\'t remember learning it.',
            use: 'The music box plays a haunting lullaby. For a moment, the room seems to shift around you.'
          },
          'A leather-bound journal rests on a side table': {
            name: 'journal',
            description: 'A worn journal with blank pages that sometimes show writing.',
            canTake: true,
            aliases: ['diary', 'book', 'leather book'],
            examine: 'The pages appear blank at first, but as you watch, familiar handwriting fades in and out, telling stories you almost remember.',
            read: 'The writing is difficult to make out, but you catch glimpses: "...happy times..." "...wish you were here..." "...please remember..."'
          },
          'A pocket watch hangs from a hook': {
            name: 'pocket watch',
            description: 'An antique gold pocket watch that never tells the same time twice.',
            canTake: true,
            aliases: ['watch', 'timepiece', 'gold watch'],
            examine: 'The watch face shows impossible times, and the second hand sometimes moves backwards. It feels important somehow.',
            use: 'The watch ticks irregularly in your hand. Time seems to flow strangely around you.'
          },
          'A child\'s toy lies forgotten in a corner': {
            name: 'toy',
            description: 'A well-loved stuffed animal that seems to change appearance.',
            canTake: true,
            aliases: ['stuffed animal', 'plush toy', 'stuffed toy'],
            examine: 'Each time you look at it, the toy seems different, yet each version feels deeply familiar. It brings comfort you don\'t understand.'
          },
          'photograph': {
            name: 'photograph',
            description: 'A sepia-toned photograph that changes its image when you blink.',
            canTake: true,
            aliases: ['photo', 'picture', 'sepia photo'],
            examine: 'The photograph shows different scenes each time you look: a birthday party, a wedding, a quiet morning. All feel like memories you can\'t quite grasp.',
            feature: 'An old photograph floats impossibly in mid-air'
          },
          'portrait': {
            name: 'portrait',
            description: 'A portrait that seems to shift and change as you look at it.',
            canTake: false
          },
          'chair': {
            name: 'chair',
            description: 'A comfortable-looking armchair that seems to belong to another time and place.',
            canTake: false
          },
          'mirror': {
            name: 'mirror',
            description: 'The mirror shows reflections that shouldn\'t be possible.',
            canTake: false
          },
          'table': {
            name: 'table',
            description: 'An elegantly set table, waiting for guests who will never arrive.',
            canTake: false
          }
        }
      },
      2: {
        name: 'Shattered Sanctum',
        sizes: ['fractured', 'broken', 'ruptured', 'unstable', 'crumbling'],
        atmospheres: [
          'violently disturbed', 'seething', 'crackling', 
          'unstable', 'turbulent', 'destructive'
        ],
        details: [
          'Deep cracks spider across the walls.',
          'The floor is littered with broken fragments.',
          'The air itself seems to vibrate with tension.',
          'Heat radiates from the scarred walls.',
          'The ceiling bears marks of violent impact.',
          'Destruction has left its mark everywhere.'
        ],
        features: [
          'Shattered crystals cover the ground, still humming with energy.',
          'A once-beautiful mural lies in pieces.',
          'Scorch marks mar every surface.',
          'Broken furniture lies scattered about.',
          'The walls bear deep, violent gashes.',
          'Everything of value has been thoroughly destroyed.'
        ],
        events: [
          'Something shatters in the distance.',
          'A wave of heat pulses through the room.',
          'The walls crack further under unseen pressure.',
          'Debris falls from fresh damage above.',
          'The ground trembles with suppressed force.',
          'The air crackles with violent energy.'
        ],
        ambience: [
          'The air burns with barely contained rage',
          'Everything vibrates with destructive energy',
          'The very stones seem to seethe with anger',
          'Heat radiates from the scarred walls',
          'The atmosphere crackles with tension',
          'Destruction hangs heavy in the air'
        ],
        conditions: [
          'Fresh cracks appear without warning',
          'The destruction is still ongoing',
          'Everything bears marks of violence',
          'Nothing remains whole or untouched',
          'The damage seems deliberate and thorough',
          'Signs of rage mark every surface'
        ],
        senses: [
          'The air tastes of ash and destruction',
          'Heat radiates from every surface',
          'The sound of breaking echoes endlessly',
          'Everything feels jagged to the touch',
          'The scent of burning lingers',
          'Your teeth vibrate with tension'
        ],
        featureItems: {
          'Shattered crystals': {
            name: 'rage shard',
            description: 'A crystal fragment humming with violent energy.',
            canTake: true,
            aliases: ['shard', 'crystal fragment']
          }
        }
      },
      3: {
        name: 'Trading Halls',
        sizes: ['labyrinthine', 'maze-like', 'winding', 'branching', 'complex'],
        atmospheres: [
          'negotiative', 'promising', 'enticing', 
          'opportunistic', 'desperate', 'hopeful'
        ],
        details: [
          'Countless paths branch in every direction.',
          'Each doorway promises a different outcome.',
          'The room seems to offer endless possibilities.',
          'Alternative routes tempt at every turn.',
          'Everything here seems to ask "what if?"',
          'Time feels fluid, as if choices could be unmade.'
        ],
        features: [
          'An ornate trading scale balances nothing against nothing.',
          'Contracts written in strange script flutter in a nonexistent wind.',
          'A merchant\'s counter stands empty, waiting for trade.',
          'Paths split and rejoin in impossible ways.',
          'Mirrors show paths not taken.',
          'A collection of keys hangs, each promising a different path.'
        ]
      },
      4: {
        name: 'Sunless Depths',
        sizes: ['vast', 'empty', 'hollow', 'endless', 'void-like'],
        atmospheres: [
          'oppressively silent', 'heavy', 'suffocating', 
          'lightless', 'weighty', 'draining'
        ],
        details: [
          'Your footsteps echo in the emptiness.',
          'The darkness seems to absorb all hope.',
          'The air feels thick with unspoken words.',
          'Time moves like molasses here.',
          'The silence weighs heavily.',
          'Even light seems to struggle here.'
        ],
        features: [
          'A void of darkness stretches endlessly.',
          'Remnants of life lie abandoned and forgotten.',
          'Shadows pool like liquid in the corners.',
          'The walls seem to absorb all sound.',
          'A heavy mist clings to everything.',
          'Light sources struggle against the darkness.'
        ]
      },
      5: {
        name: 'Tranquil Sanctuary',
        sizes: ['balanced', 'harmonious', 'peaceful', 'serene', 'complete'],
        atmospheres: [
          'calmly resolute', 'accepting', 'tranquil', 
          'understanding', 'peaceful', 'settled'
        ],
        details: [
          'The chaos and order here exist in perfect balance.',
          'Light and shadow dance in harmony.',
          'The air carries a sense of completion.',
          'Time flows naturally here, neither fast nor slow.',
          'The space feels at peace with itself.',
          'Everything here seems to have found its place.'
        ],
        features: [
          'A pool reflects both light and shadow equally.',
          'Crystal formations have grown around broken remnants.',
          'New life grows through old decay.',
          'Paths converge at a central point of calm.',
          'The room embraces both its beauty and flaws.',
          'Windows show both past and present simultaneously.'
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
    this.theme = theme;
    this.connections = new Map();
    this.items = [];
    this.features = [];
    this.discovered = false;
    this.generated = false;
    this.knownExit = false;
    
    // Store persistent description elements
    this.roomSize = '';
    this.roomAtmosphere = '';
    this.roomAmbience = '';
    this.roomFeatures = [];
  }

  generateContent() {
    if (!this.generated) {
      // Generate persistent room description elements
      this.roomSize = this.theme.getRandomSize();
      this.roomAtmosphere = this.theme.getRandomAtmosphere();
      this.roomAmbience = this.theme.getRandomAmbience();
      
      // Get all available features
      const allFeatures = [...this.theme.currentTheme.features];
      
      // Shuffle the features array
      for (let i = allFeatures.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allFeatures[i], allFeatures[j]] = [allFeatures[j], allFeatures[i]];
      }
      
      // Take 2-3 random features
      const numFeatures = getRandomInt(2, 3);
      this.roomFeatures = allFeatures.slice(0, numFeatures);
      
      // Create initial items based on features
      this.createItemsFromFeatures();
      
      this.generated = true;
    }
  }

  getFullDescription() {
    if (!this.generated) {
      this.generateContent();
    }

    let description = [];

    // Room description
    description.push(`A ${this.roomSize}, ${this.roomAtmosphere} space opens before you.`);

    // Ambience
    if (this.roomAmbience) {
      description.push(this.roomAmbience + '.');
    }

    // Features with interactable items
    if (this.roomFeatures && this.roomFeatures.length > 0) {
      description.push('\nIn this room:');
      this.roomFeatures.forEach(feature => {
        let modifiedFeature = feature;
        
        // Find any items that are part of this feature
        const featureItems = this.items.filter(item => item.feature === feature);

        if (featureItems.length > 0) {
          featureItems.forEach(item => {
            const itemName = item.name;
            if (!modifiedFeature.includes(`<item>${itemName}</item>`)) {
              const regex = new RegExp(`\\b${itemName}\\b`, 'gi');
              modifiedFeature = modifiedFeature.replace(regex, `<item>${itemName}</item>`);
            }
          });
          description.push(`  - ${modifiedFeature}`);
        } else {
          // Skip features that had items that were taken
          const itemKey = Object.keys(this.theme.currentTheme.featureItems || {})
            .find(key => feature.toLowerCase().includes(key.toLowerCase()));
          
          if (!itemKey) {
            // Only show features that never had items
            description.push(`  - ${feature}`);
          }
        }
      });
    }

    // Loose items (not part of features)
    const looseItems = this.items.filter(item => !item.feature);
    if (looseItems.length > 0) {
      description.push('\nYou can see:');
      looseItems.forEach(item => {
        description.push(`  - <item>${item.name}</item>`);
      });
    }

    // Exits
    const exits = this.getExits();
    description.push('\nExits:');
    Object.entries(exits).forEach(([direction, state]) => {
      description.push(`  - ${direction}: ${state}`);
    });

    return description.join('\n');
  }

  // Remove updateDescription as it's no longer needed
  discover() {
    if (!this.discovered) {
      this.discovered = true;
      if (!this.generated) {
        this.generateContent();
      }
      
      this.connections.forEach(({ room: connectedRoom }) => {
        connectedRoom.partiallyDiscover();
      });
    }
  }

  partiallyDiscover() {
    // Just mark that we know this is an exit
    this.knownExit = true;
  }

  createItemsFromFeatures() {
    // Clear existing feature-based items
    this.items = this.items.filter(item => !item.feature);

    // For each feature in the room
    this.roomFeatures.forEach(feature => {
      // Check each feature item definition
      Object.entries(this.theme.currentTheme.featureItems || {}).forEach(([key, itemDef]) => {
        // Check if this feature matches the item's associated feature text
        if (itemDef.feature === feature || feature.toLowerCase().includes(key.toLowerCase())) {
          // Create a new item based on the definition
          this.items.push({
            ...itemDef,
            feature: feature
          });
        }
      });
    });
  }

  getExits() {
    const exits = {};
    this.connections.forEach((connection, roomId) => {
      exits[connection.direction] = connection.state || 'open';
    });
    return exits;
  }

  connectTo(room, direction) {
    // Only allow connections if rooms are adjacent
    const ROOM_SPACING = this.width + 2; // Same spacing as used in generation
    const dx = room.x - this.x;
    const dy = room.y - this.y;
    
    const isAdjacent = (
      (direction === 'east' && dx === ROOM_SPACING && Math.abs(dy) < 1) ||
      (direction === 'west' && dx === -ROOM_SPACING && Math.abs(dy) < 1) ||
      (direction === 'south' && dy === ROOM_SPACING && Math.abs(dx) < 1) ||
      (direction === 'north' && dy === -ROOM_SPACING && Math.abs(dx) < 1)
    );

    if (isAdjacent) {
      this.connections.set(room.id, {
        room: room,
        direction: direction,
        state: 'open'
      });
    }
  }

  getCenter() {
    return {
      x: this.x + this.width/2,
      y: this.y + this.height/2
    };
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
    this.nextRoomId = 0; // Add this to track room IDs
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
    const startRoom = new Room(this.getNextRoomId(), centerX, centerY, ROOM_SIZE, ROOM_SIZE, this.theme);
    this.rooms.set(startRoom.id, startRoom);

    // Generate additional rooms
    for (let i = 1; i < this.numRooms; i++) {
      this.addAdjacentRoom(ROOM_SIZE);
    }

    // Add extra connections for variety
    this.connectRooms();
    this.addExtraConnections();
  }

  getNextRoomId() {
    return this.nextRoomId++;
  }

  addAdjacentRoom(roomSize) {
    // Pick a random existing room to branch from
    const existingRooms = Array.from(this.rooms.values());
    const parentRoom = existingRooms[Math.floor(Math.random() * existingRooms.length)];
    const newRoomId = this.getNextRoomId();

    // Room spacing should be roomSize + 1 for corridors
    const ROOM_SPACING = roomSize + 2;
    
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
        const newRoom = new Room(newRoomId, newX, newY, roomSize, roomSize, this.theme);
        this.rooms.set(newRoomId, newRoom);
        
        // Create bidirectional connections with proper opposite directions
        const oppositeDir = this.getOppositeDirection(dir);
        parentRoom.connectTo(newRoom, dir);
        newRoom.connectTo(parentRoom, oppositeDir);
        return;
      }
    }

    // If we couldn't place the room, try again with a different parent
    if (existingRooms.length > 1) {
      this.addAdjacentRoom(roomSize);
    }
  }

  getOppositeDirection(dir) {
    const opposites = {
      'north': 'south',
      'south': 'north',
      'east': 'west',
      'west': 'east'
    };
    return opposites[dir];
  }

  hasOverlap(x, y, size) {
    const BUFFER = 2; // Increased buffer between rooms
    return Array.from(this.rooms.values()).some(room => {
      return !(x + size + BUFFER <= room.x || 
               x >= room.x + room.width + BUFFER ||
               y + size + BUFFER <= room.y || 
               y >= room.y + room.height + BUFFER);
    });
  }

  isValidPosition(x, y, size) {
    return x >= 0 && x + size <= this.width && y >= 0 && y + size <= this.height;
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
        const roomA = this.rooms.get(roomAId);
        const roomB = this.rooms.get(roomBId);
        // Add bidirectional connections
        roomA.connectTo(roomB, bestDirection);
        roomB.connectTo(roomA, this.getOppositeDirection(bestDirection));
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
        // Add bidirectional connections
        roomA.connectTo(roomB, direction);
        roomB.connectTo(roomA, this.getOppositeDirection(direction));
      }
    }
  }

  getCurrentRoom() {
    return this.rooms.get(this.currentRoomId);
  }

  isConsistentWithConnections(x, y, direction) {
    // Check if the new position makes sense with existing connections
    return true; // Implement proper validation
  }
}


export { Dungeon, Room }; 