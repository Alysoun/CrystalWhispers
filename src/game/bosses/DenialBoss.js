export const DenialBoss = {
  name: 'The Eternal Mirror',
  health: 80,
  maxHealth: 80,
  attack: 10,
  defense: 5,
  experience: 100,
  description: 'A figure of shifting reflections, reality seems to bend around it',
  
  dialogue: [
    "System Error: Reality Not Found",
    "LOAD \"REALITY\", 8, 1... ERROR",
    "Attempting to restore previous save state..."
  ],
  deathQuote: "The reflection finally shows the truth...",

  // Simplified mechanics for first boss
  specialAbilities: {
    mirrorImage: {
      name: "Mirror Image",
      description: "Creates a reflection of itself",
      effect: "Creates one mirror image that must be identified from the real boss",
      dialogue: "Which one is real?",
      tell: "The real Mirror Keeper casts a subtle shadow"
    },
    realityShift: {
      name: "Reality Shift",
      description: "Swaps places with its image",
      effect: "Switches position with its mirror image",
      dialogue: "Things aren't always where they seem...",
      cooldown: 3
    }
  },

  // Simplified phases
  phases: [
    {
      healthThreshold: 80,
      message: "The room fills with mirrors...",
      activeAbilities: ['mirrorImage']
    },
    {
      healthThreshold: 40,
      message: "The mirrors begin to move...",
      activeAbilities: ['mirrorImage', 'realityShift']
    }
  ],

  // Tutorial hints that appear during the fight
  tutorialHints: [
    "Hint: Look carefully for shadows to identify the real Mirror Keeper",
    "Hint: When the boss shifts, take a moment to observe before attacking",
    "Hint: The mirror image cannot cast spells, only the real boss can"
  ],

  roomDescription: {
    base: "A hall of corrupted pixels stretches before you, each glitch slightly different from the last.",
    features: [
      "Screen artifacts dance across the walls",
      "Your sprite doesn't quite match your movements",
      "Error messages flash in and out of existence"
    ],
    atmosphere: "The air crackles with digital static."
  },

  // Crystal-specific behaviors
  crystalBehaviors: {
    DEFIANCE: {
      name: "Defiant Reflections",
      description: "Mirror images now fight back independently",
      modifiedAbilities: {
        mirrorImage: {
          name: "Aggressive Reflection",
          description: "Creates a reflection that can attack",
          effect: "Mirror image deals 50% of boss damage",
          dialogue: "Face yourself..."
        }
      }
    },

    RESILIENCE: {
      name: "Endless Mirrors",
      description: "Mirror images split when attacked",
      modifiedAbilities: {
        mirrorImage: {
          name: "Splitting Image",
          description: "Images create new copies when hit",
          effect: "Each image splits once when damaged (max 4 images)",
          dialogue: "Break one, face many..."
        }
      }
    },

    REFLECTION: {
      name: "True Mirrors",
      description: "Mirror images copy player abilities",
      modifiedAbilities: {
        mirrorCopy: {
          name: "Perfect Mimicry",
          description: "Copies player's last action",
          effect: "Images use player's own attacks against them",
          dialogue: "Your strength becomes your weakness..."
        }
      }
    },

    CHALLENGE: {
      name: "Reality Fracture",
      description: "Room layout changes with each mirror phase",
      modifiedAbilities: {
        realityBend: {
          name: "Shattered Reality",
          description: "Completely changes the battlefield",
          effect: "Rearranges room features and mirror positions",
          dialogue: "Nothing stays the same..."
        }
      }
    }
  },

  // Method to apply crystal modifications
  applyCrystalBehaviors(activeCrystals) {
    let modifiedBoss = { ...this };
    
    activeCrystals.forEach(crystal => {
      if (this.crystalBehaviors[crystal]) {
        const behavior = this.crystalBehaviors[crystal];
        
        // Add new abilities
        modifiedBoss.specialAbilities = {
          ...modifiedBoss.specialAbilities,
          ...behavior.modifiedAbilities
        };

        // Modify room description
        modifiedBoss.roomDescription.features.push(
          `The mirrors seem to ${behavior.description.toLowerCase()}`
        );

        // Add crystal-specific combat phases
        modifiedBoss.phases.push({
          healthThreshold: 60,
          message: `${behavior.name} activates!`,
          activeAbilities: [...Object.keys(behavior.modifiedAbilities)]
        });
      }
    });

    return modifiedBoss;
  }
}; 