export const Story = {
  introduction: [
    "The screen flickers to life, green text on black...",
    "The system feels familiar, like an old friend.",
    "Commands await your input, just like they used to.",
    "Something tells you this journey is important, though you can't quite remember why..."
  ],

  // Subtle hints in room descriptions
  levelOneThemes: {
    normalRooms: [
      "The pixels seem to shift when you're not looking directly at them...",
      "There's a faint beeping sound, steady and rhythmic...",
      "You've been here before... haven't you?",
      "The room's edges blur like an unfocused monitor..."
    ],
    // Special rooms have more specific descriptions
    specialRooms: {
      memory: {
        first: "A scene flickers across the screen, almost too fast to catch...",
        hidden: "The beeping falters for a moment, then continues..."
      },
      revelation: {
        first: "The display seems clearer here, though you're not sure why...",
        hidden: "For a moment, you hear voices outside the game..."
      }
    }
  },

  // Revealed gradually through gameplay
  memoryFragments: [
    "LOAD \"*\", 8, 1",
    "PRESS PLAY ON TAPE",
    "The familiar clack of a keyboard...",
    "Weekend afternoons spent in digital worlds..."
  ],

  // These only show after beating Acceptance
  revealedTruths: [
    "The beeping was always there, wasn't it?",
    "Those voices... they were never part of the game.",
    "One last adventure, rendered in perfect 8-bit clarity.",
    "Some games aren't meant to be won, only experienced."
  ]
}; 