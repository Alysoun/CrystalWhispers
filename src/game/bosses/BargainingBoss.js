export const BargainingBoss = {
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
  deathQuote: "No price can change what was...",
  specialAbilities: {
    temporalDeal: {
      name: "Temporal Deal",
      description: "Offers to restore health in exchange for player's experience",
      effect: "Heals 30 HP, costs 50 XP"
    },
    rewindTime: {
      name: "Rewind Time",
      description: "Attempts to undo the last round of combat",
      effect: "Restores previous turn's HP to both combatants"
    }
  }
}; 