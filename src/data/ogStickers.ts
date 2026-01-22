/**
 * OG Sticker Collection - 50 exclusive Original stickers
 * Special collection for early adopters and VIP members
 */

import type { Rarity } from './stickers';
import { OG_STICKER_IMAGES_BY_ID } from './stickerImages';

export interface OGSticker {
  /** Unique token ID (OG-1 to OG-50) */
  id: number;
  /** Slot within the OG page (1-50) */
  slot: number;
  /** Rarity tier - OG stickers have higher rare/epic chances */
  rarity: Rarity;
  /** Display name */
  name: string;
  /** Always "OG" category */
  category: 'OG';
  /** Season identifier */
  season: 0; // OG is pre-season
  /** Image URL */
  imageUrl: string;
  /** Whether this is an OG sticker */
  isOG: true;
}

// OG-themed names (matching generated images where available)
const OG_NAMES = [
  'Genesis Founder',
  'Alpha Pioneer',
  'First Mover',
  'Early Bird',
  'Trailblazer',
  'OG Legend',
  'Diamond Hands',    // ID 7 - Diamond Ape image
  'Moon Walker',      // ID 8 - Moonshot image
  'Crypto King',
  'NFT Master',
  'Whale Whisperer',
  'Chain Breaker',
  'Block Builder',
  'Token Titan',
  'Mint Maestro',
  'Gas Guru',
  'Degen Duke',
  'Yield Hunter',
  'Stake Master',
  'Pool Pioneer',
  'Swap Sage',
  'Bridge Baron',
  'Layer Legend',
  'Protocol Prince',
  'Legendary Crown',  // ID 25 - Crown image (Legendary)
  'Governance God',
  'Vote Vanguard',
  'Proposal Pro',
  'Treasury Titan',
  'Audit Ace',
  'Security Sage',
  'Smart Contract',
  'Solidity Star',
  'Vyper Victor',
  'Rust Ranger',
  'Move Master',
  'Cairo Captain',
  'ZK Zealot',
  'Rollup Rider',
  'Optimist Oracle',
  'Arbitrum Ace',
  'Polygon Pro',
  'Base Builder',
  'Mooby Master',
  'Sticker Sultan',
  'Album Admiral',
  'Collection Chief',
  'Rarity Royal',
  'Epic Elder',
  'Legendary Lord',   // ID 50 - Crown image (Legendary)
];

/**
 * Determines rarity for OG stickers
 * OG stickers have better odds: Common 50%, Rare 30%, Epic 15%, Legendary 5%
 */
function determineOGRarity(slot: number): Rarity {
  // Legendary: slots 25 and 50
  if (slot === 25 || slot === 50) {
    return 'legendary';
  }
  
  // Epic: slots 10, 20, 30, 40, 48, 49
  if ([10, 20, 30, 40, 48, 49].includes(slot)) {
    return 'epic';
  }
  
  // Rare: slots ending in 5, 6, 7, 8, 9 (except legendaries)
  if (slot % 10 >= 5 && slot !== 25) {
    return 'rare';
  }
  
  return 'common';
}

/**
 * Generate OG image URL - uses actual image if available, otherwise placeholder
 */
function generateOGImageUrl(id: number, rarity: Rarity): string {
  // Check if we have an actual image for this OG sticker
  const actualImage = OG_STICKER_IMAGES_BY_ID.get(id);
  if (actualImage) {
    return actualImage;
  }
  
  // Fallback to placeholder with gold/black theme
  const colors: Record<Rarity, string> = {
    common: '1a1a1a',
    rare: '1e40af',
    epic: '7e22ce',
    legendary: 'd97706',
  };
  return `https://placehold.co/400x560/${colors[rarity]}/ffd700?text=OG-${id}`;
}

/**
 * Generates all 50 OG stickers
 */
export function generateOGStickers(): OGSticker[] {
  const stickers: OGSticker[] = [];
  
  for (let slot = 1; slot <= 50; slot++) {
    const rarity = determineOGRarity(slot);
    
    stickers.push({
      id: slot,
      slot,
      rarity,
      name: OG_NAMES[slot - 1],
      category: 'OG',
      season: 0,
      imageUrl: generateOGImageUrl(slot, rarity),
      isOG: true,
    });
  }
  
  return stickers;
}

// Pre-generated OG sticker data
export const OG_STICKERS: OGSticker[] = generateOGStickers();

// Lookup map for quick access
export const OG_STICKERS_BY_ID = new Map<number, OGSticker>(
  OG_STICKERS.map(s => [s.id, s])
);

// OG rarity distribution counts
export const OG_RARITY_COUNTS: Record<Rarity, number> = OG_STICKERS.reduce(
  (acc, s) => {
    acc[s.rarity]++;
    return acc;
  },
  { common: 0, rare: 0, epic: 0, legendary: 0 }
);

// Constants
export const TOTAL_OG_STICKERS = 50;
