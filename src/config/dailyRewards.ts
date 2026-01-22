/**
 * Daily Login Rewards Configuration
 * 7-day cycle with different rewards for regular users and NFT holders
 */

// Reward schedule for 7-day cycle (1-indexed for days)
export const DAILY_REWARDS_SCHEDULE = [
  { day: 1, packs: 1 },
  { day: 2, packs: 1 },
  { day: 3, packs: 1 },
  { day: 4, packs: 2 },
  { day: 5, packs: 1 },
  { day: 6, packs: 1 },
  { day: 7, packs: 3 },
] as const;

// Pack configurations
export const DAILY_PACK_CONFIG = {
  regular: {
    name: 'Daily Login Pack',
    stickersPerPack: 2,
    // Standard rarity chances
    rarityChances: {
      common: 0.60,
      rare: 0.25,
      epic: 0.12,
      legendary: 0.03,
    },
  },
  og: {
    name: 'OG Daily Login Pack',
    stickersPerPack: 4,
    // Improved rarity chances for OG holders
    rarityChances: {
      common: 0.35,
      rare: 0.35,
      epic: 0.22,
      legendary: 0.08,
    },
  },
} as const;

// Total stickers per week
export const WEEKLY_STICKERS = {
  regular: DAILY_REWARDS_SCHEDULE.reduce((sum, day) => sum + day.packs, 0) * DAILY_PACK_CONFIG.regular.stickersPerPack, // 10 packs * 2 = 20 stickers
  og: DAILY_REWARDS_SCHEDULE.reduce((sum, day) => sum + day.packs, 0) * DAILY_PACK_CONFIG.og.stickersPerPack, // 10 packs * 4 = 40 stickers
};

// Storage key for daily login data
export const DAILY_LOGIN_STORAGE_KEY = 'daily_login_data';

export interface DailyLoginData {
  lastClaimDate: string | null; // ISO date string (YYYY-MM-DD)
  currentDay: number; // 1-7
  streak: number; // consecutive days claimed
}

// Helper to get today's date as string
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to check if a date is yesterday
export function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
}

// Helper to check if a date is today
export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}
