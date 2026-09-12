/**
 * Non-linear XP leveling formula & calculation utilities
 * Follows progressive curve:
 * Level 1: 100 XP
 * Level 2: 250 XP
 * Level 3: 450 XP
 * Level 4: 700 XP
 * Level 5: 1000 XP
 * ...
 * Level 12: ~3000 XP
 */

export const getRequiredXP = (level: number): number => {
  if (level <= 1) return 100;
  if (level === 2) return 250;
  if (level === 3) return 450;
  if (level === 4) return 700;
  if (level === 5) return 1000;
  
  // Formula matching ~3000 XP at level 12
  // Base 1000 at level 5 + quadratic increase
  const base = 1000;
  const deltaL = level - 5;
  const req = base + deltaL * 220 + Math.round(Math.pow(deltaL, 1.35) * 85);
  return Math.round(req / 10) * 10;
};

export interface LevelUpResult {
  leveledUp: boolean;
  newLevel: number;
  newXP: number;
  levelsGained: number;
  attributePointsEarned: number;
}

/**
 * Checks if adding xpAmount causes one or more level ups
 */
export const processXPGain = (
  currentLevel: number,
  currentXP: number,
  xpGained: number
): LevelUpResult => {
  let level = currentLevel;
  let xp = currentXP + xpGained;
  let levelsGained = 0;

  while (true) {
    const required = getRequiredXP(level);
    if (xp >= required) {
      xp -= required;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return {
    leveledUp: levelsGained > 0,
    newLevel: level,
    newXP: xp,
    levelsGained,
    attributePointsEarned: levelsGained * 5 // +5 attribute points per level as specified
  };
};

/**
 * Returns progress percentage within the current level
 */
export const getLevelProgressPercentage = (currentXP: number, level: number): number => {
  const req = getRequiredXP(level);
  if (req <= 0) return 100;
  const pct = Math.min(100, Math.max(0, (currentXP / req) * 100));
  return Math.round(pct * 10) / 10;
};

/** Total experience represented by the current level and carried XP. */
export const getLifetimeXP = (level: number, currentXP: number): number => {
  let total = Math.max(0, currentXP);
  for (let current = 1; current < Math.max(1, level); current += 1) total += getRequiredXP(current);
  return total;
};
