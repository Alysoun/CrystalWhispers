export const AngerBoss = {
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
  deathQuote: "The flames subside, leaving only warm memories...",
  // Unique mechanics for Anger boss
  specialAbilities: {
    ragingInferno: {
      name: "Raging Inferno",
      description: "Increases attack but lowers defense",
      effect: "Attack +50%, Defense -25%"
    }
  }
}; 