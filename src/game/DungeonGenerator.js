import { getRandomInt } from '../utils/helpers';
import { getBossForLevel } from './bosses/GriefBosses';
import { TreasurePool } from './treasures/TreasurePool';
import { PuzzlePool } from './puzzles/PuzzlePool';
import { MirrorSequence } from './puzzles/puzzles/MirrorSequence';

class FloorTheme {
  constructor(level) {
    this.themes = {
      1: {
        name: 'Memory Banks',
        sizes: ['8-bit', 'pixelated', 'low-res', 'glitching', '16-color'],
        atmospheres: [
          'softly humming', 'gently flickering', 'faintly buzzing', 
          'quietly processing', 'steadily running', 'dimly glowing'
        ],
        details: [
          'Scan lines ripple across the walls.',
          'The resolution seems to shift and change.',
          'Pixels reorganize themselves when you look away.',
          'Code fragments scroll by in the air.',
          'The cursor blinks patiently in the corner.',
          'Loading screens appear in impossible places.'
        ],
        features: [
          'An old save file floats impossibly in the air.',
          'A command prompt blinks endlessly.',
          'Sprites animate in impossible patterns.',
          'A high score table updates itself.',
          'Loading bars progress without end.',
          'Corrupted pixels form familiar shapes.'
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

  generateRoomDescription(room) {
    let description = [];
    
    // Add atmospheric description
    description.push(room.description);
    
    // If room has a puzzle, add it to description without command tags
    if (room.puzzle) {
      description.push("There seems to be a puzzle here. Type 'examine puzzle' to investigate it more closely.");
    }

    // List room features
    if (room.features && room.features.length > 0) {
      description.push("In this room:");
      room.features.forEach(feature => {
        description.push(`  - ${feature}`);
      });
    }

    return description.join("\n");
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
  constructor(id, x, y, width, height, theme, dungeon) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.dungeon = dungeon;
    this.connections = new Map();
    this.items = [];
    this.features = [];
    this.discovered = false;
    this.contentGenerated = false;
    this.knownExit = false;
    this.featureItems = new Map();
    
    // Initialize room description elements
    this.description = this.generateBaseDescription();
    this.roomSize = theme.getRandomSize();
    this.roomAtmosphere = theme.getRandomAtmosphere();
    this.roomAmbience = theme.getRandomAmbience();
    this.roomFeatures = theme.getRandomFeatures(3); // Get 3 random features

    // Initialize pools
    this.treasurePool = new TreasurePool();
    this.puzzlePool = new PuzzlePool();
  }

  generateBaseDescription() {
    const size = this.theme.getRandomSize();
    const atmosphere = this.theme.getRandomAtmosphere();
    const ambience = this.theme.getRandomAmbience();
    
    return `You're in a ${size} ${atmosphere} chamber. ${ambience || ''}`.trim();
  }

  generateContent() {
    if (!this.contentGenerated) {
      // Calculate distance from start room
      const startRoom = Array.from(this.dungeon.rooms.values()).find(r => r.id === 0);
      const distanceFromStart = Math.abs(this.x - startRoom.x) + Math.abs(this.y - startRoom.y);
      const isFarFromStart = distanceFromStart > 15; // Adjust this value as needed

      const totalRooms = this.dungeon.rooms.size;
      const minimums = {
        combat: Math.floor(totalRooms * 0.4),
        treasure: 1,
        puzzle: 2,
        boss: 1
      };
      
      const maximums = {
        combat: Math.ceil(totalRooms * 0.6), // At most 60% combat rooms
        treasure: 2,
        puzzle: 5,
        boss: 1
      };

      // Get current counts of each room type
      const counts = {
        combat: Array.from(this.dungeon.rooms.values()).filter(r => r.roomType === 'combat').length,
        treasure: Array.from(this.dungeon.rooms.values()).filter(r => r.roomType === 'treasure').length,
        puzzle: Array.from(this.dungeon.rooms.values()).filter(r => r.roomType === 'puzzle').length,
        boss: Array.from(this.dungeon.rooms.values()).filter(r => r.roomType === 'boss').length,
      };

      // Determine what room types are still needed
      const needed = {
        combat: minimums.combat - counts.combat > 0,
        treasure: minimums.treasure - counts.treasure > 0,
        puzzle: minimums.puzzle - counts.puzzle > 0,
        boss: minimums.boss - counts.boss > 0
      };

      // Determine what room types are still allowed
      const allowed = {
        combat: counts.combat < maximums.combat,
        treasure: counts.treasure < maximums.treasure,
        puzzle: counts.puzzle < maximums.puzzle,
        boss: counts.boss < maximums.boss
      };

      // If we need any specific room type, prioritize that
      if (needed.boss && isFarFromStart) {
        this.roomType = 'boss';
      } else if (needed.treasure) {
        this.roomType = 'treasure';
      } else if (needed.puzzle) {
        this.roomType = 'puzzle';
      } else if (needed.combat) {
        this.roomType = 'combat';
      } else {
        // Otherwise, randomly select from allowed types
        const roomTypeRoll = Math.random() * 100;
        
        if (allowed.combat && roomTypeRoll < 60) {
          this.roomType = 'combat';
        } else if (allowed.puzzle && roomTypeRoll < 75) {
          this.roomType = 'puzzle';
        } else if (allowed.treasure && roomTypeRoll < 85) {
          this.roomType = 'treasure';
        } else {
          this.roomType = 'normal';
        }
      }

      console.log(`Room ${this.id} assigned type: ${this.roomType}`);

      // Generate appropriate content based on room type
      switch (this.roomType) {
        case 'combat':
          this.enemyType = this.generateEnemy();
          this.description += '\n\nThere is a hostile presence here...';
          break;
        case 'treasure':
          this.treasure = this.generateTreasure();
          this.description += '\n\nSomething valuable catches your eye...';
          break;
        case 'puzzle':
          this.generatePuzzle();
          // Puzzle description is added in generatePuzzle()
          break;
        case 'boss':
          this.enemyType = this.generateBossEnemy();
          this.description += '\n\nA powerful entity awaits...';
          break;
        default:
          this.generateNormalContent();
      }

      // Create items based on room features
      this.createItemsFromFeatures();
      this.contentGenerated = true;
    }
  }

  generateEnemy() {
    // Basic enemy types for now
    const enemies = [
      {
        name: 'Shadow Remnant',
        health: 30,
        maxHealth: 30,
        attack: 5,
        defense: 2,
        experience: 20
      },
      {
        name: 'Memory Fragment',
        health: 20,
        maxHealth: 20,
        attack: 8,
        defense: 1,
        experience: 15
      },
      {
        name: 'Forgotten Echo',
        health: 40,
        maxHealth: 40,
        attack: 4,
        defense: 3,
        experience: 25
      }
    ];

    return enemies[Math.floor(Math.random() * enemies.length)];
  }

  generateBossEnemy() {
    const boss = getBossForLevel(this.dungeon.level);
    if (!boss) {
      console.error('No boss defined for this level!');
      return null;
    }
    return boss;
  }

  getFullDescription() {
    if (!this.contentGenerated) {
      this.generateContent();
    }

    let description = [];

    // Base room description
    description.push(this.description);

    // Features with interactable items
    if (this.roomFeatures.length > 0) {
      description.push('\nIn this room:');
      this.roomFeatures.forEach(feature => {
        // Get items associated with this feature
        const featureItems = this.featureItems.get(feature) || [];
        if (featureItems.length > 0) {
          let featureText = feature;
          featureItems.forEach(item => {
            // Make sure we're marking the item name as interactable
            const itemName = item.name.toLowerCase();
            const featureLower = feature.toLowerCase();
            if (featureLower.includes(itemName)) {
              featureText = featureText.replace(
                new RegExp(`\\b${item.name}\\b`, 'gi'),
                `<item>${item.name}</item>`
              );
            }
          });
          description.push(`  - ${featureText}`);
        } else {
          description.push(`  - ${feature}`);
        }
      });
    }

    // If this is a puzzle room, add a hint about interaction
    if (this.puzzle && !this.puzzle.solved && !this.puzzle.destroyed) {
      description.push('\nThere seems to be a puzzle here. Type "examine puzzle" to investigate it more closely.');
    }

    // Loose items
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
      
      // Generate room content if not already generated
      if (!this.contentGenerated) {
        this.generateContent();
        this.contentGenerated = true;
      }

      // Mark connected rooms as having known exits
      this.connections.forEach(({ room: connectedRoom }) => {
        connectedRoom.knownExit = true;
      });
    }
  }

  partiallyDiscover() {
    // Just mark that we know this is an exit
    this.knownExit = true;
  }

  createItemsFromFeatures() {
    if (!this.items) {
      this.items = [];
    }
    if (!this.featureItems) {
      this.featureItems = new Map();
    }

    this.roomFeatures.forEach(feature => {
      // Check each feature item definition for a match
      Object.entries(this.theme.currentTheme.featureItems).forEach(([key, itemDef]) => {
        // Check if the feature contains the key or vice versa
        if (feature.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(feature.toLowerCase())) {
          const item = {
            ...itemDef,
            feature: feature,
            id: `item_${this.id}_${key}`,
            discovered: false
          };
          this.items.push(item);
          
          // Store reference to feature items
          const featureItems = this.featureItems.get(feature) || [];
          featureItems.push(item);
          this.featureItems.set(feature, featureItems);
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

  generateTreasure() {
    // Rarity chances
    const roll = Math.random();
    let rarity;
    if (roll < 0.60) rarity = 'common';
    else if (roll < 0.85) rarity = 'uncommon';
    else if (roll < 0.95) rarity = 'rare';
    else rarity = 'legendary';

    return this.treasurePool.getRandomTreasure(rarity);
  }

  generatePuzzle() {
    const difficulty = Math.min(5, Math.ceil(this.theme.level / 2));
    this.puzzle = this.puzzlePool.getRandomPuzzle(difficulty);
    
    if (this.puzzle) {
      // Add a subtle hint about the puzzle to the room's base description
      this.description += '\n\nSomething about this room feels particularly enigmatic...';
      
      // Add puzzle-specific features that hint at interaction
      const puzzleFeature = this.puzzle.getFeature();
      if (puzzleFeature) {
        this.roomFeatures = this.roomFeatures.filter(f => !f.includes('puzzle'));
        this.roomFeatures.push(puzzleFeature);
      }

      // Add puzzle hint to room features
      this.roomFeatures.push('There seems to be a puzzle here. Type "examine puzzle" to investigate it more closely.');
    }
  }

  generateNormalContent() {
    // Add random event to normal rooms occasionally
    if (Math.random() < 0.3) {
      const event = this.theme.getRandomEvent();
      if (event) {
        this.description += `\n\n${event}`;
      }
    }
  }

  examinePuzzle() {
    if (this.puzzle && !this.puzzle.solved) {
      return {
        type: 'puzzle',
        content: this.puzzle.getDescription(),
        puzzle: this.puzzle
      };
    } else if (this.puzzle && this.puzzle.solved) {
      return {
        type: 'message',
        content: 'You\'ve already solved this puzzle.'
      };
    }
    return {
      type: 'message',
      content: 'There\'s no puzzle to examine here.'
    };
  }

  removeItem(itemToRemove) {
    if (!this.items) {
      this.items = [];
      return false;
    }

    const index = this.items.findIndex(item => 
      item.name === itemToRemove.name || 
      (item.aliases && item.aliases.includes(itemToRemove.name))
    );

    if (index !== -1) {
      // If item is associated with a feature, update feature items
      if (itemToRemove.feature) {
        const featureItems = this.featureItems.get(itemToRemove.feature) || [];
        this.featureItems.set(
          itemToRemove.feature,
          featureItems.filter(item => item.name !== itemToRemove.name)
        );

        // Update the room features to remove or modify the feature text
        this.roomFeatures = this.roomFeatures.map(feature => {
          if (feature === itemToRemove.feature) {
            // If this was the only item in the feature, remove or modify the feature
            const remainingItems = this.featureItems.get(feature) || [];
            if (remainingItems.length === 0) {
              // Remove feature entirely if it was just about the item
              if (feature.toLowerCase().includes(itemToRemove.name.toLowerCase())) {
                return null;
              }
              // Otherwise modify the feature to indicate item was taken
              return feature.replace(
                new RegExp(`\\b${itemToRemove.name}\\b.*?(?=\\.|$)`, 'i'),
                'An empty hook remains'
              );
            }
          }
          return feature;
        }).filter(Boolean); // Remove null entries
      }

      // Remove from items array
      this.items.splice(index, 1);
      return true;
    }
    return false;
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
    this.nextRoomId = 0;
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
    
    const startRoom = new Room(
      this.getNextRoomId(), 
      centerX, 
      centerY, 
      ROOM_SIZE, 
      ROOM_SIZE, 
      this.theme,
      this
    );
    
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
        const newRoom = new Room(
          newRoomId, 
          newX, 
          newY, 
          roomSize, 
          roomSize, 
          this.theme,
          this
        );
        this.rooms.set(newRoomId, newRoom);
        
        // Create bidirectional connections
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