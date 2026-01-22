/**
 * Pack Configuration for the NFT Sticker Album
 * Defines pack types, pricing, odds, and guarantees
 */

import type { Rarity } from './stickers';

export type PackType = 'basic' | 'silver' | 'gold';

export interface PackConfig {
  /** Pack type identifier */
  type: PackType;
  /** Display name */
  name: string;
  /** Number of stickers per pack */
  stickerCount: number;
  /** Price in MATIC (as string for precision) */
  price: string;
  /** Price display (formatted) */
  priceDisplay: string;
  /** Pack description */
  description: string;
  /** Guaranteed minimum rarities */
  guarantees: PackGuarantee[];
  /** Base odds for non-guaranteed slots */
  odds: RarityOdds;
  /** Visual styling */
  style: PackStyle;
}

export interface PackGuarantee {
  /** Minimum rarity for this guarantee */
  minRarity: Rarity;
  /** Number of guaranteed slots */
  count: number;
  /** Description for UI */
  description: string;
}

export interface RarityOdds {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface PackStyle {
  /** Primary gradient colors */
  gradient: string;
  /** Glow color */
  glow: string;
  /** Border color */
  border: string;
  /** Icon/badge color */
  accent: string;
}

/**
 * Pack configurations
 */
export const PACK_CONFIGS: Record<PackType, PackConfig> = {
  basic: {
    type: 'basic',
    name: 'Basic Pack',
    stickerCount: 3,
    price: '0.001',
    priceDisplay: '0.001 POL',
    description: '3 stickers with a chance for rare upgrades',
    guarantees: [
      {
        minRarity: 'common',
        count: 2,
        description: '2 Common guaranteed',
      },
      {
        minRarity: 'common', // 1 slot with upgrade chance
        count: 1,
        description: '1 slot with upgrade chance',
      },
    ],
    odds: {
      common: 0.70,
      rare: 0.22,
      epic: 0.07,
      legendary: 0.01,
    },
    style: {
      gradient: 'from-slate-600 to-slate-800',
      glow: 'shadow-slate-500/30',
      border: 'border-slate-500',
      accent: 'text-slate-300',
    },
  },
  silver: {
    type: 'silver',
    name: 'Silver Pack',
    stickerCount: 5,
    price: '0.002',
    priceDisplay: '0.002 POL',
    description: '5 stickers with at least 1 Rare guaranteed',
    guarantees: [
      {
        minRarity: 'rare',
        count: 1,
        description: '1 Rare+ guaranteed',
      },
    ],
    odds: {
      common: 0.60,
      rare: 0.28,
      epic: 0.10,
      legendary: 0.02,
    },
    style: {
      gradient: 'from-blue-500 to-blue-700',
      glow: 'shadow-blue-500/40',
      border: 'border-blue-400',
      accent: 'text-blue-300',
    },
  },
  gold: {
    type: 'gold',
    name: 'Gold Pack',
    stickerCount: 7,
    price: '0.005',
    priceDisplay: '0.005 POL',
    description: '7 stickers with premium guarantees',
    guarantees: [
      {
        minRarity: 'rare',
        count: 2,
        description: '2 Rare+ guaranteed',
      },
      {
        minRarity: 'epic',
        count: 1,
        description: '1 Premium slot (Epic+ chance)',
      },
    ],
    odds: {
      common: 0.45,
      rare: 0.35,
      epic: 0.15,
      legendary: 0.05,
    },
    style: {
      gradient: 'from-yellow-500 to-amber-600',
      glow: 'shadow-yellow-500/50',
      border: 'border-yellow-400',
      accent: 'text-yellow-300',
    },
  },
};

/**
 * Craft/Burn recipes
 */
export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  input: {
    rarity: Rarity;
    count: number;
  };
  output: {
    rarity: Rarity;
    count: number;
  };
}

export const CRAFT_RECIPES: CraftRecipe[] = [
  {
    id: 'common-to-rare',
    name: 'Forge Rare',
    description: 'Combine 5 Common stickers to forge 1 Rare',
    input: { rarity: 'common', count: 5 },
    output: { rarity: 'rare', count: 1 },
  },
  {
    id: 'rare-to-epic',
    name: 'Forge Epic',
    description: 'Combine 4 Rare stickers to forge 1 Epic',
    input: { rarity: 'rare', count: 4 },
    output: { rarity: 'epic', count: 1 },
  },
  {
    id: 'epic-to-legendary',
    name: 'Forge Legendary',
    description: 'Combine 3 Epic stickers to forge 1 Legendary',
    input: { rarity: 'epic', count: 3 },
    output: { rarity: 'legendary', count: 1 },
  },
];

/**
 * Pack type display order
 */
export const PACK_ORDER: PackType[] = ['basic', 'silver', 'gold'];

/**
 * Get odds percentage display
 */
export function formatOdds(odds: number): string {
  return `${(odds * 100).toFixed(1)}%`;
}
