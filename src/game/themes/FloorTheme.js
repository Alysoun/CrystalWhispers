import { getRandomInt } from '../../utils/helpers';

export class FloorTheme {
  constructor(level) {
    this.level = Number(level) || 1;
    
    // Define themes before trying to access them
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
            aliases: ['pictures', 'paintings', 'portrait', 'portraits'],
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
            aliases: ['chair', 'rocking chair'],
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
            aliases: ['shelf', 'books', 'bookcase'],
            examine: 'Each time you look, the titles are different, yet oddly familiar.',
            onExamine: {
              chance: 0.35,
              fragments: { min: 2, max: 4 },
              message: 'One of the titles sparks a memory...'
            }
          },
          fireplace: {
            name: 'fireplace',
            description: 'A fireplace with dancing flames that emit no heat.',
            canTake: false,
            aliases: ['hearth', 'fire'],
            examine: 'The flames move in patterns that seem to tell stories from your past.',
            onExamine: {
              chance: 0.3,
              fragments: { min: 2, max: 5 },
              message: 'The dancing flames stir a distant memory...'
            }
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
              chance: 0.4,
              fragments: { min: 3, max: 6 },
              message: 'The melody triggers a cascade of memories...'
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

    // Now we can safely access this.themes
    this.currentTheme = this.themes[this.level] || this.themes[1];
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

  getRandomAmbience() {
    if (this.currentTheme.ambience) {
      return this.currentTheme.ambience[getRandomInt(0, this.currentTheme.ambience.length)];
    }
    return null;
  }

  getRandomEvent() {
    return this.currentTheme.events[getRandomInt(0, this.currentTheme.events.length)];
  }

  getRandomDetail() {
    return this.currentTheme.details[getRandomInt(0, this.currentTheme.details.length)];
  }

  generateRoomDescription(room) {
    let description = [];
    
    // Add atmospheric description
    description.push(room.description);
    
    // If room has a puzzle, add it to description
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
}