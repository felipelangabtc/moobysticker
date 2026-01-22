/**
 * Sticker Images - Mapping of sticker IDs to generated images
 * This provides a sample set of images for testing
 */

// Import generated sticker images
import legendaryGoldenWarrior from '@/assets/stickers/legendary-golden-warrior.png';
import epicPhoenix from '@/assets/stickers/epic-phoenix.png';
import rareIceDragon from '@/assets/stickers/rare-ice-dragon.png';
import commonForestWolf from '@/assets/stickers/common-forest-wolf.png';
import ogLegendaryCrown from '@/assets/stickers/og-legendary-crown.png';
import epicThunderKnight from '@/assets/stickers/epic-thunder-knight.png';
import rareCosmicWizard from '@/assets/stickers/rare-cosmic-wizard.png';
import commonFireSalamander from '@/assets/stickers/common-fire-salamander.png';
import rareShadowNinja from '@/assets/stickers/rare-shadow-ninja.png';
import ogDiamondApe from '@/assets/stickers/og-diamond-ape.png';
import commonCrystalGolem from '@/assets/stickers/common-crystal-golem.png';
import legendaryCelestialDragon from '@/assets/stickers/legendary-celestial-dragon.png';
import epicLeviathan from '@/assets/stickers/epic-leviathan.png';
import ogMoonshot from '@/assets/stickers/og-moonshot.png';

// Sample sticker data with actual images
export interface StickerImageData {
  id: number;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

// Season 1 sample stickers with generated images
export const SAMPLE_STICKERS: StickerImageData[] = [
  // Legendary
  { id: 150, name: 'Golden Warrior', image: legendaryGoldenWarrior, rarity: 'legendary', category: 'Champions' },
  { id: 300, name: 'Celestial Dragon', image: legendaryCelestialDragon, rarity: 'legendary', category: 'Immortals' },
  
  // Epic
  { id: 28, name: 'Arcane Phoenix', image: epicPhoenix, rarity: 'epic', category: 'Legends' },
  { id: 58, name: 'Thunder Knight', image: epicThunderKnight, rarity: 'epic', category: 'Rising Stars' },
  { id: 88, name: 'Ocean Leviathan', image: epicLeviathan, rarity: 'epic', category: 'Champions' },
  
  // Rare
  { id: 22, name: 'Frost Dragon', image: rareIceDragon, rarity: 'rare', category: 'Legends' },
  { id: 52, name: 'Cosmic Wizard', image: rareCosmicWizard, rarity: 'rare', category: 'Rising Stars' },
  { id: 85, name: 'Shadow Ninja', image: rareShadowNinja, rarity: 'rare', category: 'Champions' },
  
  // Common
  { id: 1, name: 'Forest Wolf', image: commonForestWolf, rarity: 'common', category: 'Legends' },
  { id: 2, name: 'Ember Salamander', image: commonFireSalamander, rarity: 'common', category: 'Legends' },
  { id: 3, name: 'Crystal Golem', image: commonCrystalGolem, rarity: 'common', category: 'Legends' },
];

// OG Collection sample stickers with generated images
export const OG_SAMPLE_STICKERS: StickerImageData[] = [
  { id: 25, name: 'Legendary Crown', image: ogLegendaryCrown, rarity: 'legendary', category: 'OG' },
  { id: 50, name: 'Legendary Lord', image: ogLegendaryCrown, rarity: 'legendary', category: 'OG' },
  { id: 7, name: 'Diamond Hands', image: ogDiamondApe, rarity: 'common', category: 'OG' },
  { id: 8, name: 'Moon Walker', image: ogMoonshot, rarity: 'common', category: 'OG' },
];

// Map for quick lookup
export const STICKER_IMAGES_BY_ID = new Map<number, string>([
  // Season 1 stickers
  [1, commonForestWolf],
  [2, commonFireSalamander],
  [3, commonCrystalGolem],
  [22, rareIceDragon],
  [28, epicPhoenix],
  [52, rareCosmicWizard],
  [58, epicThunderKnight],
  [85, rareShadowNinja],
  [88, epicLeviathan],
  [150, legendaryGoldenWarrior],
  [300, legendaryCelestialDragon],
]);

// OG sticker images (IDs are 1-50 for OG collection)
export const OG_STICKER_IMAGES_BY_ID = new Map<number, string>([
  [7, ogDiamondApe],
  [8, ogMoonshot],
  [25, ogLegendaryCrown],
  [50, ogLegendaryCrown],
]);

// Helper to get sticker image by ID (falls back to placeholder)
export function getStickerImage(id: number, isOG: boolean = false): string {
  if (isOG) {
    return OG_STICKER_IMAGES_BY_ID.get(id) || '';
  }
  return STICKER_IMAGES_BY_ID.get(id) || '';
}
