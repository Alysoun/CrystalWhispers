// The 5 stages of grief as boss encounters
export const GriefBosses = {
  DENIAL: {
    name: 'The Eternal Mirror',
    health: 100,
    maxHealth: 100,
    attack: 12,
    defense: 8,
    experience: 100,
    description: 'A reflection that refuses to show what is real',
    dialogue: [
      "This isn't happening...",
      "Everything is fine, just like before...",
      "You're not really here...",
    ],
    deathQuote: "The reflection finally shows the truth..."
  },

  ANGER: {
    name: 'The Raging Flame',
    health: 120,
    maxHealth: 120,
    attack: 15,
    defense: 6,
    experience: 120,
    description: 'A burning manifestation of uncontrolled fury',
    dialogue: [
      "Why did this happen?!",
      "It's not fair!",
      "Everything burns!",
    ],
    deathQuote: "The flames subside, leaving only warm memories..."
  },

  BARGAINING: {
    name: 'The Time Merchant',
    health: 90,
    maxHealth: 90,
    attack: 10,
    defense: 12,
    experience: 110,
    description: 'A shadowy figure offering impossible deals',
    dialogue: [
      "Just one more moment...",
      "What would you give to change things?",
      "There must be another way...",
    ],
    deathQuote: "No price can change what was..."
  },

  DEPRESSION: {
    name: 'The Void Walker',
    health: 110,
    maxHealth: 110,
    attack: 8,
    defense: 15,
    experience: 130,
    description: 'An all-consuming emptiness given form',
    dialogue: [
      "Why continue?",
      "The darkness is peaceful...",
      "Nothing matters anymore...",
    ],
    deathQuote: "Light pierces through the darkness..."
  },

  ACCEPTANCE: {
    name: 'Memory\'s Guardian',
    health: 150,
    maxHealth: 150,
    attack: 14,
    defense: 10,
    experience: 150,
    description: 'A peaceful but resolute keeper of what was',
    dialogue: [
      "Are you ready to remember?",
      "The past is past, but not forgotten.",
      "Some things must end for others to begin.",
    ],
    deathQuote: "Peace, at last..."
  }
};

export const getBossForLevel = (level) => {
  const stages = Object.values(GriefBosses);
  if (level > 0 && level <= stages.length) {
    return stages[level - 1];
  }
  return null;
}; 