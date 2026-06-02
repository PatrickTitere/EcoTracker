export function xpToLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpProgressInLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const level = xpToLevel(xp);
  const xpForCurrent = (level - 1) ** 2 * 100;
  const xpForNext = level ** 2 * 100;
  const current = xp - xpForCurrent;
  const needed = xpForNext - xpForCurrent;
  return {
    current,
    needed,
    percent: Math.min(100, Math.round((current / needed) * 100)),
  };
}