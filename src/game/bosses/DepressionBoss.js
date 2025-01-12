export const DepressionBoss = {
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
  deathQuote: "Light pierces through the darkness...",
  specialAbilities: {
    crushingDespair: {
      name: "Crushing Despair",
      description: "Reduces player's attack power",
      effect: "Player attack -25% for 3 turns"
    },
    voidEmbrace: {
      name: "Void Embrace",
      description: "Absorbs damage to heal itself",
      effect: "Converts 50% of damage taken into healing"
    }
  }
}; 