import { getRandomInt } from '../utils/helpers';
import { getBossForLevel } from './bosses/GriefBosses';
import { TreasurePool } from './treasures/TreasurePool';
import { PuzzlePool } from './puzzles/PuzzlePool';
import { MirrorSequence } from './puzzles/puzzles/MirrorSequence';

class FloorTheme {
  constructor(level) {
    this.level = Number(level) || 1;
    
    this.themes = {
      1: {
        name: 'The Unchanging Halls',
        sizes: ['familiar', 'distorted', 'unchanging', 'preserved', 'perfect'],
        atmospheres: [
          'eerily peaceful', 'unnaturally still', 'frozen in time', 
          'strangely pristine', 'impossibly perfect', 'deceptively calm'
        ],
        details: [
          'The walls seem to resist any change.',
          'Time seems to stand completely still here.',
          'Everything remains in a perfect state.',
          'Nothing shows any sign of age or wear.',
          'The air feels thick with suspended moments.',
          'Reflections shimmer with strange certainty.'
        ],
        features: [
          'A clock whose hands never move.',
          'A mirror that only shows happy memories.',
          'A window that always shows a perfect summer day.',
          'Family portraits where everyone is always smiling.',
          'Fresh flowers that never wilt.',
          'A table perpetually set for dinner guests.',
          'A music box playing a familiar lullaby.',
          'A rocking chair gently swaying on its own.',
          'A child\'s toy that winds itself up.',
          'A bookshelf where the stories keep changing.',
          'A fireplace with eternal flames that give no heat.',
          'A grandfather clock striking the same hour endlessly.',
          'A chess set mid-game with no players.',
          'A tea set that stays eternally warm.',
          'A crystal chandelier casting impossible shadows.',
          'A piano that plays soft melodies by itself.',
          'A cabinet of curiosities that rearranges itself.',
          'A tapestry showing scenes from your memories.',
          'A fountain whose water flows upward.',
          'A collection of photographs that change when unobserved.',
          'A kaleidoscope showing impossible patterns.',
          'A snow globe containing a perfect winter day.',
          'A sundial casting shadows that tell different times.',
          'An hourglass where sand flows both ways.',
        ],
        events: [
          'A memory flickers at the edge of your vision.',
          'The sound of familiar laughter echoes distantly.',
          'Voices carry on conversations as if nothing has changed.',
          'Time seems to skip like a broken record.',
          'The room refuses to acknowledge any change.',
          'Reality bends to match your preferred memories.'
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
          mirror: {
            name: 'mirror',
            description: 'A mirror that only shows happy memories.',
            canTake: false,
            aliases: ['mirror', 'reflection'],
            examine: 'The reflection shows only joyful moments from your past.',
            onExamine: {
              chance: 0.3,  // 30% chance to get fragments
              fragments: { min: 2, max: 5 },
              message: 'A fleeting memory surfaces as you gaze into the mirror...'
            }
          },
          table: {
            name: 'table',
            description: 'A table perpetually set for dinner guests.',
            canTake: false,
            aliases: ['dining table', 'set table'],
            examine: 'The table settings are pristine, as if waiting for guests who never arrive.'
          },
          clock: {
            name: 'clock',
            description: 'A clock whose hands refuse to move.',
            canTake: true,
            aliases: ['timepiece', 'wall clock'],
            examine: 'The hands are frozen at a significant moment. You could take it as a memory.',
            onExamine: {
              chance: 0.25,
              fragments: { min: 1, max: 3 },
              message: 'The phantom ticking stirs a distant memory...'
            },
            onTake: {
              message: 'The clock face shimmers as you take it, its hands forever marking this moment...',
              fragments: 20
            }
          },
          window: {
            name: 'window',
            description: 'A window showing an eternal summer day.',
            canTake: false,
            aliases: ['glass', 'pane'],
            examine: 'Through the glass, you see a perfect day that never ends.'
          },
          portraits: {
            name: 'portraits',
            description: 'Family portraits with ever-smiling faces.',
            canTake: false,
            aliases: ['pictures', 'paintings'],
            examine: 'The faces in the portraits seem to follow you with their unchanging smiles.'
          },
          flowers: {
            name: 'flowers',
            description: 'Fresh flowers in eternal bloom.',
            canTake: true,
            aliases: ['bouquet', 'vase'],
            examine: "The flowers look freshly cut, yet you sense they've been here forever. You could take them with you.",
            onTake: {
              message: 'The flowers retain their perfect bloom as you gather them, their eternal spring now yours...',
              fragments: 15
            }
          },
          'music box': {
            name: 'music box',
            description: 'A delicate music box playing a hauntingly familiar tune.',
            canTake: true,
            aliases: ['box', 'musical box'],
            examine: 'The melody seems to change with your memories, yet remains familiar. You could take it with you.',
            onTake: {
              message: 'The music box plays a tune from your childhood as you pick it up...',
              fragments: 30
            },
            onExamine: {
              chance: 0.4,  // Higher chance since it's music-related
              fragments: { min: 3, max: 6 },
              message: 'The melody triggers a cascade of memories...'
            }
          },
          'rocking chair': {
            name: 'rocking chair',
            description: 'An old rocking chair moving to an unseen presence.',
            canTake: false,
            aliases: ['chair'],
            examine: 'The chair rocks with the same rhythm as a long-forgotten comfort.'
          },
          toy: {
            name: 'toy',
            description: 'A mechanical toy that winds itself up periodically.',
            canTake: true,
            aliases: ['mechanical toy', 'wind-up toy'],
            examine: 'The toy seems to respond to your presence, as if remembering past play. You could take it as a memory.',
            onTake: {
              message: 'The toy whirs happily as you pick it up, reminding you of simpler times...',
              fragments: 25
            }
          },
          bookshelf: {
            name: 'bookshelf',
            description: 'A bookshelf filled with ever-changing stories.',
            canTake: false,
            aliases: ['shelf', 'books'],
            examine: 'Each time you look, the titles are different, yet oddly familiar.'
          },
          fireplace: {
            name: 'fireplace',
            description: 'A fireplace with dancing flames that emit no heat.',
            canTake: false,
            aliases: ['hearth', 'fire'],
            examine: 'The flames move in patterns that seem to tell stories from your past.'
          },
          'chess set': {
            name: 'chess set',
            description: 'A chess game frozen mid-play, pieces moved by phantom players.',
            canTake: true,
            aliases: ['chess', 'chess pieces'],
            examine: 'The position of the pieces reminds you of a game long forgotten. You could take it as a memory.',
            onTake: {
              message: 'As you pick up the chess set, memories of past matches and strategies flood back...',
              fragments: 20
            }
          },
          'tea set': {
            name: 'tea set',
            description: 'A fine porcelain tea set, steam eternally rising.',
            canTake: true,
            aliases: ['teapot', 'cups'],
            examine: 'The tea inside stays perfectly hot, waiting for guests who never arrive. You could take it as a memory.',
            onTake: {
              message: 'As you pick up the tea set, the warmth of shared moments flows through you...',
              fragments: 25
            }
          },
          chandelier: {
            name: 'chandelier',
            description: 'A crystal chandelier casting ever-shifting shadows.',
            canTake: false,
            aliases: ['light', 'crystals'],
            examine: 'The shadows it casts seem to dance to the rhythm of remembered moments.'
          },
          piano: {
            name: 'piano',
            description: 'A grand piano that plays gentle melodies without a pianist.',
            canTake: false,
            aliases: ['grand piano', 'keys'],
            examine: 'The keys move to play a song you remember from childhood.',
            onExamine: {
              chance: 0.35,
              fragments: { min: 2, max: 4 },
              message: 'The familiar tune awakens forgotten memories...'
            }
          },
          tapestry: {
            name: 'tapestry',
            description: 'A woven tapestry showing scenes from your memories.',
            canTake: false,
            aliases: ['hanging', 'weaving'],
            examine: 'The scenes in the tapestry shift and change as you watch.'
          },
          fountain: {
            name: 'fountain',
            description: 'A fountain with water that defies gravity.',
            canTake: false,
            aliases: ['water feature', 'basin'],
            examine: 'The water flows upward, forming patterns that remind you of better times.'
          },
          kaleidoscope: {
            name: 'kaleidoscope',
            description: 'A mysterious kaleidoscope showing impossible patterns.',
            canTake: true,
            aliases: ['scope', 'viewer'],
            examine: 'Looking through it reveals fragments of memories, endlessly recombining. You could take it as a memory.',
            onTake: {
              message: 'The kaleidoscope shifts as you pick it up, showing glimpses of forgotten moments...',
              fragments: 35
            }
          },
          'snow globe': {
            name: 'snow globe',
            description: 'A snow globe containing a perfect winter scene.',
            canTake: true,
            aliases: ['globe', 'snowglobe'],
            examine: 'The snow falls endlessly, preserving a perfect moment in time. You could take it with you.',
            onTake: {
              message: 'As you lift the snow globe, memories of winter days swirl like snowflakes...',
              fragments: 25
            }
          },
          hourglass: {
            name: 'hourglass',
            description: 'An hourglass where sand flows in both directions.',
            canTake: true,
            aliases: ['timer', 'sandglass'],
            examine: 'The sand defies gravity, flowing both up and down in an endless cycle. You could take it with you.',
            onTake: {
              message: 'As you grasp the hourglass, time seems to flow backwards for a moment...',
              fragments: 30
            }
          },
          'book': {
            name: 'book',
            description: 'A leather-bound book whose pages write themselves.',
            canTake: true,
            aliases: ['tome', 'journal'],
            examine: 'The pages fill with your own memories as you watch. You could take it with you.',
            onTake: {
              message: "The book's pages flutter with stories from your past as you pick it up...",
              fragments: 20
            }
          },
          'locket': {
            name: 'locket',
            description: 'A silver locket showing different faces each time it opens.',
            canTake: true,
            aliases: ['pendant', 'necklace'],
            examine: 'Each time the locket opens, it shows different cherished faces. You could take it as a memory.',
            onTake: {
              message: 'The locket warms in your hand, faces of loved ones flashing through its frame...',
              fragments: 30
            }
          },
          sundial: {
            name: 'sundial',
            description: 'A sundial casting impossible shadows.',
            canTake: true,
            aliases: ['dial', 'time piece'],
            examine: 'The shadows move independently of any light source. You could take this timepiece with you.',
            onTake: {
              message: "The sundial's shadow spins rapidly as you lift it, showing glimpses of times past...",
              fragments: 15
            }
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

    this.currentTheme = this.themes[this.level] || this.themes[1];
  }

  generateRoomDescription(room) {
    let description = [];
    
    // Add atmospheric description
    description.push(room.description);
    
    // If room has a puzzle, add it to description without command tags
    if (room.puzzle) {
      description.push("A series of mirrors arranged in a mysterious pattern. You can <command>examine puzzle</command> to take a closer look, but be careful - failure could be catastrophic.");
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
    this.cleared = false;
    this.enemyState = null;
    
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
          if (!this.cleared && !this.enemyState) {
            this.enemy = this.generateEnemy();
          } else if (this.enemyState) {
            this.enemy = this.enemyState;
          }
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
            // Only wrap the item name itself in tags
            featureText = featureText.replace(
              new RegExp(`\\b${item.name}\\b`, 'gi'),
              `<item>${item.name}</item>`
            );
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

    // Add combat encounter only if room isn't cleared
    if (this.roomType === 'combat' && !this.cleared && (this.enemy || this.enemyState)) {
      description.push('\nThere is a hostile presence here...');
    }

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
    if (!this.roomFeatures) return;

    console.log('Room features:', this.roomFeatures);
    this.items = this.roomFeatures.map(feature => {
      // Extract the basic item type from the feature text
      const itemTypes = {
        'mirror that only shows': 'mirror',
        'table perpetually set': 'table',
        'clock whose hands': 'clock',
        'window that always shows': 'window',
        'portraits where everyone': 'portraits',
        'flowers that never': 'flowers',
        'music box playing': 'music box',
        'rocking chair gently': 'rocking chair',
        'child\'s toy that winds': 'toy',
        'bookshelf where': 'bookshelf',
        'fireplace with eternal': 'fireplace',
        'chess set mid-game': 'chess set',
        'tea set that stays': 'tea set',
        'crystal chandelier casting': 'chandelier',
        'piano that plays': 'piano',
        'tapestry showing scenes': 'tapestry',
        'fountain whose water': 'fountain',
        'kaleidoscope showing': 'kaleidoscope',
        'snow globe containing': 'snow globe',
        'hourglass where sand': 'hourglass',
        'sundial casting shadows': 'sundial'
      };
      
      // Find matching item type
      const itemType = Object.entries(itemTypes)
        .find(([key, _]) => feature.toLowerCase().includes(key.toLowerCase()));
      
      console.log('Creating item from feature:', feature, itemType);
      
      if (itemType) {
        const [_, type] = itemType;
        // Get the item definition from featureItems in the current theme
        const definition = this.theme.currentTheme.featureItems[type] || {
          name: type,
          description: feature,
          canTake: false
        };
        
        return {
          ...definition,
          id: type,  // Use the matched type directly
          feature: feature
        };
      }
      return null;
    }).filter(Boolean);

    console.log('Created items:', this.items);

    // Store feature-item relationships
    this.featureItems = new Map();
    this.items.forEach(item => {
      if (item.feature) {
        const featureItems = this.featureItems.get(item.feature) || [];
        featureItems.push(item);
        this.featureItems.set(item.feature, featureItems);
      }
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
      // Add a subtle hint about the puzzle to the room's description
      this.description += '\n\nSomething about this room feels particularly enigmatic...';
      
      // Add puzzle-specific features that hint at interaction
      const puzzleFeature = this.puzzle.getFeature();
      if (puzzleFeature) {
        this.roomFeatures = this.roomFeatures.filter(f => !f.includes('puzzle'));
        this.roomFeatures.push(puzzleFeature);
      }
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
      const item = this.items[index];
      const result = {
        success: true,
        message: '',
        fragments: 0
      };
      
      if (item.onTake) {
        result.fragments = item.onTake.fragments;
        result.message = [
          item.onTake.message,
          `The ${item.name} dissolves into ${item.onTake.fragments} memory fragments as you grasp it...`
        ].join('\n');
      }

      // If item is associated with a feature, update feature items
      if (itemToRemove.feature) {
        const featureItems = this.featureItems.get(itemToRemove.feature) || [];
        this.featureItems.set(
          itemToRemove.feature,
          featureItems.filter(item => item.name !== itemToRemove.name)
        );

        // Update the room features...
      }

      // Remove from items array
      this.items.splice(index, 1);
      return result;
    }
    return { success: false, message: "You can't take that.", fragments: 0 };
  }

  handleCombatEnd(result) {
    if (result.victory) {
      this.cleared = true;
      this.enemyState = null;
    } else if (result.fled) {
      this.enemyState = {
        ...this.enemy,
        health: this.enemy.health
      };
    }
    this.enemy = null;
  }

  examineItem(itemName) {
    const item = this.items.find(i => 
      i.name === itemName || 
      (i.aliases && i.aliases.includes(itemName))
    );
    
    if (item) {
      const result = {
        description: item.examine,
        fragments: 0,
        message: null
      };
      
      // Check for examination reward
      if (item.onExamine) {
        const roll = Math.random();
        if (roll < item.onExamine.chance) {
          const fragmentAmount = Math.floor(
            Math.random() * 
            (item.onExamine.fragments.max - item.onExamine.fragments.min + 1) +
            item.onExamine.fragments.min
          );
          result.fragments = fragmentAmount;
          result.message = item.onExamine.message;
        }
      }
      
      return result;
    }
    
    return null;
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