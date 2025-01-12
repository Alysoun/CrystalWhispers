import { DenialBoss } from './DenialBoss';
import { AngerBoss } from './AngerBoss';
import { BargainingBoss } from './BargainingBoss';
import { DepressionBoss } from './DepressionBoss';
import { AcceptanceBoss } from './AcceptanceBoss';

// The five stages of grief in order
export const GriefStages = {
  DENIAL: 1,
  ANGER: 2,
  BARGAINING: 3,
  DEPRESSION: 4,
  ACCEPTANCE: 5
};

export const GriefBosses = [
  DenialBoss,    // Level 1
  AngerBoss,     // Level 2
  BargainingBoss, // Level 3
  DepressionBoss, // Level 4
  AcceptanceBoss  // Level 5
];

export const getBossForLevel = (level) => {
  if (level > 0 && level <= GriefBosses.length) {
    return GriefBosses[level - 1];
  }
  return null;
};

export const getBossStage = (level) => {
  return Object.entries(GriefStages).find(([_, value]) => value === level)?.[0] || null;
}; 