/**
 * Season 1 Sticker Data - 300 stickers across 10 pages
 * Each page has 30 slots (3 rows of 10)
 */

import { STICKER_IMAGES_BY_ID } from './stickerImages';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Category = 
  | 'Legends' 
  | 'Rising Stars' 
  | 'Champions' 
  | 'Hall of Fame' 
  | 'World Class' 
  | 'Icons' 
  | 'Prodigies' 
  | 'Masters' 
  | 'Elite' 
  | 'Immortals'
  | 'OG';

export interface Sticker {
  /** Unique token ID (1-300) */
  id: number;
  /** Album page (1-10) */
  page: number;
  /** Slot within page (1-30) */
  slot: number;
  /** Rarity tier */
  rarity: Rarity;
  /** Display name */
  name: string;
  /** Category group */
  category: Category;
  /** Season identifier */
  season: number;
  /** Image URL */
  imageUrl: string;
}

// Category distribution per page
const CATEGORIES: Category[] = [
  'Legends',
  'Rising Stars', 
  'Champions',
  'Hall of Fame',
  'World Class',
  'Icons',
  'Prodigies',
  'Masters',
  'Elite',
  'Immortals',
];

// Named stickers with actual images - these get priority
const NAMED_STICKERS: Record<number, string> = {
  1: 'Forest Wolf',
  2: 'Ember Salamander',
  3: 'Crystal Golem',
  22: 'Frost Dragon',
  28: 'Arcane Phoenix',
  52: 'Cosmic Wizard',
  58: 'Thunder Knight',
  85: 'Shadow Ninja',
  88: 'Ocean Leviathan',
  150: 'Golden Warrior',
  300: 'Celestial Dragon',
};

// Names pool for variety
const CREATURE_NAMES = [
  'Ancient Griffin', 'Blazing Wyvern', 'Cursed Specter', 'Dark Sentinel', 'Ethereal Spirit',
  'Fierce Chimera', 'Glacial Titan', 'Haunted Wraith', 'Iron Colossus', 'Jade Serpent',
  'Kraken Lord', 'Lightning Beast', 'Mystic Unicorn', 'Night Stalker', 'Onyx Gargoyle',
  'Primal Behemoth', 'Quartz Guardian', 'Raging Minotaur', 'Storm Elemental', 'Thunder Hawk',
  'Undying Revenant', 'Void Walker', 'War Hydra', 'Xeno Hunter', 'Yeti Berserker',
  'Zephyr Phoenix', 'Amber Drake', 'Bronze Golem', 'Crimson Basilisk', 'Dawn Rider',
  'Eclipse Knight', 'Flame Djinn', 'Ghost Samurai', 'Holy Paladin', 'Inferno Demon',
  'Jungle Predator', 'Karma Spirit', 'Lunar Wolf', 'Mountain Giant', 'Nebula Mage',
  'Ocean Guardian', 'Poison Wyrm', 'Quantum Shifter', 'Radiant Angel', 'Sand Scorpion',
  'Tempest Archer', 'Ultra Beast', 'Venom Spider', 'Wind Dancer', 'Xylo Warrior',
];

/**
 * Generates a deterministic sticker name based on ID
 */
function generateStickerName(id: number): string {
  // Check if this sticker has a named image
  if (NAMED_STICKERS[id]) {
    return NAMED_STICKERS[id];
  }
  // Otherwise use creature names
  const nameIndex = (id * 7) % CREATURE_NAMES.length;
  return CREATURE_NAMES[nameIndex];
}

/**
 * Determines rarity based on slot position and page
 * Distribution: Common 70%, Rare 22%, Epic 7%, Legendary 1%
 */
function determineRarity(page: number, slot: number, id: number): Rarity {
  // Legendary slots: last slot of pages 5 and 10
  if ((page === 5 || page === 10) && slot === 30) {
    return 'legendary';
  }
  
  // Epic slots: slots 28-29 of each page (2 per page = 20 total ≈ 7%)
  if (slot >= 28 && slot <= 29) {
    return 'epic';
  }
  
  // Rare slots: slots 22-27 of each page (6 per page = 60 total ≈ 20%)
  // Plus some extras to hit ~22%
  if (slot >= 22 && slot <= 27) {
    return 'rare';
  }
  
  // Additional rare spots (to reach ~22%)
  if (slot === 15 && page % 2 === 0) {
    return 'rare';
  }
  
  return 'common';
}

/**
 * Generate image URL - uses actual image if available, otherwise placeholder
 */
function generateImageUrl(id: number, rarity: Rarity): string {
  // Check if we have an actual image for this sticker
  const actualImage = STICKER_IMAGES_BY_ID.get(id);
  if (actualImage) {
    return actualImage;
  }
  
  // Fallback to placeholder
  const colors: Record<Rarity, string> = {
    common: '64748b',
    rare: '3b82f6',
    epic: 'a855f7',
    legendary: 'eab308',
  };
  return `https://placehold.co/400x560/${colors[rarity]}/fff?text=${id}`;
}

/**
 * Generates all 300 stickers for Season 1
 */
export function generateSeason1Stickers(): Sticker[] {
  const stickers: Sticker[] = [];
  
  for (let page = 1; page <= 10; page++) {
    for (let slot = 1; slot <= 30; slot++) {
      const id = (page - 1) * 30 + slot;
      const rarity = determineRarity(page, slot, id);
      
      stickers.push({
        id,
        page,
        slot,
        rarity,
        name: generateStickerName(id),
        category: CATEGORIES[page - 1],
        season: 1,
        imageUrl: generateImageUrl(id, rarity),
      });
    }
  }
  
  return stickers;
}

// Pre-generated sticker data
export const SEASON_1_STICKERS: Sticker[] = generateSeason1Stickers();

// Lookup maps for quick access
export const STICKERS_BY_ID = new Map<number, Sticker>(
  SEASON_1_STICKERS.map(s => [s.id, s])
);

export const STICKERS_BY_PAGE = new Map<number, Sticker[]>();
for (let page = 1; page <= 10; page++) {
  STICKERS_BY_PAGE.set(page, SEASON_1_STICKERS.filter(s => s.page === page));
}

// Rarity distribution counts
export const RARITY_COUNTS: Record<Rarity, number> = SEASON_1_STICKERS.reduce(
  (acc, s) => {
    acc[s.rarity]++;
    return acc;
  },
  { common: 0, rare: 0, epic: 0, legendary: 0 }
);

// Constants
export const TOTAL_STICKERS = 300;
export const TOTAL_PAGES = 10;
export const STICKERS_PER_PAGE = 30;
export const SEASON = 1;
