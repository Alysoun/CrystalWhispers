export const AcceptanceToken = {
  id: 'acceptance_token',
  name: 'Crystal of Acceptance',
  description: "A small, perfectly clear crystal that seems to make the immutable... mutable.",
  examine: "As you hold it, you feel a strange peace. Things you thought were unchangeable begin to shift.",
  canTake: true,
  isSpecial: true,
  memoryValue: 50,
  memoryText: "Some things must change, even memories we hold dear...",
  
  // Special ability to allow taking "untakeable" items
  useWith: (item) => {
    if (!item.canTake) {
      return {
        success: true,
        message: "The crystal glows softly. What once seemed permanently fixed in place now feels... different.",
        effect: () => {
          item.canTake = true;
          item.description = `${item.description} The crystal's power has made this memory portable.`;
          return item;
        }
      };
    }
    return {
      success: false,
      message: "The crystal remains inert. This memory is already within your grasp."
    };
  },

  // Only obtainable after certain conditions
  requirements: {
    bossesDefeated: ['mirror_keeper'], // First boss must be defeated
    memoryFragments: 100, // Need certain number of fragments
    puzzlesSolved: 3 // Need to have solved some puzzles
  }
}; 