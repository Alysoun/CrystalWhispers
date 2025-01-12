export const AcceptanceBoss = {
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
  deathQuote: "Peace, at last...",
  specialAbilities: {
    memoryFlood: {
      name: "Memory Flood",
      description: "Overwhelms with recovered memories",
      effect: "Chance to stun player for 1 turn"
    },
    peacefulResolution: {
      name: "Peaceful Resolution",
      description: "Offers a chance to end combat peacefully",
      effect: "Both combatants heal, combat can end without death"
    }
  }
}; 