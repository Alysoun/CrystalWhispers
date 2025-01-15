export const DenialBoss = {
    // Get number of times player has completed the game
    getGameCompletions() {
        return parseInt(localStorage.getItem('gameCompletions') || '0');
    },

    // Base stats that scale with game completions
    baseStats: {
        health: 80,
        attack: 8,
        defense: 5
    },

    // Just two phases for the demo
    difficultyLevels: [
        {
            multipliers: { health: 1, attack: 1 },
            name: "The Mirror Keeper",
            description: "A mysterious figure wrapped in reflective surfaces",
            roomDescription: {
                base: "You enter a chamber of mirrors. Each surface reflects a different memory, all of them painful.",
                features: ["mirrors", "reflections", "shadows"]
            }
        },
        {
            multipliers: { health: 1.5, attack: 1.2 },
            name: "The Memory's Denial",
            description: "The figure's form shifts between reflections with newfound purpose",
            roomDescription: {
                base: "The mirror chamber pulses with remembered pain. The reflections show moments you've tried to forget.",
                features: ["shifting mirrors", "memory echoes", "distorted reflections"]
            }
        }
    ],

    // Core abilities for first phase
    baseAbilities: {
        mirrorImage: {
            name: "Mirror Image",
            description: "Creates reflections of itself",
            damage: 0,
            effect: "Creates mirror images that must be identified from the real boss",
            imageCount: 3
        },
        shatteringStrike: {
            name: "Shattering Strike",
            description: "A powerful blow that can break defenses",
            damage: 12,
            effect: "Reduces player defense temporarily"
        }
    },

    // Second phase adds one new ability
    enhancedAbilities: {
        realityShift: {
            name: "Reality Shift",
            description: "Swaps places with its image",
            damage: 0,
            effect: "Switches position with mirror image and increases next attack damage",
            bonusDamage: 5
        }
    },

    // Dialogue for both phases
    dialogueByPhase: [
        [
            "Why do you persist in remembering?",
            "These memories only bring pain...",
            "Let them fade into darkness..."
        ],
        [
            "You dare return? There are darker truths ahead...",
            "Your memories are chains that bind you.",
            "What you seek... you may not wish to find..."
        ]
    ],

    spawn() {
        const completions = Math.min(this.getGameCompletions(), 1); // Cap at 1 for demo
        const config = this.difficultyLevels[completions];
        
        // Calculate scaled stats
        const stats = {
            health: Math.floor(this.baseStats.health * config.multipliers.health),
            attack: Math.floor(this.baseStats.attack * config.multipliers.attack),
            defense: this.baseStats.defense,
            maxHealth: Math.floor(this.baseStats.health * config.multipliers.health)
        };

        // Combine abilities based on phase
        let abilities = { ...this.baseAbilities };
        if (completions > 0) {
            abilities = { 
                ...abilities, 
                ...this.enhancedAbilities,
                mirrorImage: {
                    ...this.baseAbilities.mirrorImage,
                    imageCount: 4  // More images in phase 2
                }
            };
        }

        return {
            ...config,
            ...stats,
            abilities,
            dialogue: this.dialogueByPhase[completions],
            isBoss: true,
            appearance: {
                ascii: [
                    "   ╔═══╗   ",
                    "   ║ ◊ ║   ",
                    " ╔═╝   ╚═╗ ",
                    " ║ ◊   ◊ ║ ",
                    " ╚═╗   ╔═╝ ",
                    "   ║ ◊ ║   ",
                    "   ╚═══╝   "
                ]
            },
            phase: completions,
            hasRealityShift: completions > 0
        };
    }
}; 