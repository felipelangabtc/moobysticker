/**
 * Application Constants and Configuration
 * Centralized configuration for the NFT Sticker Album
 */

// =============================================================================
// BLOCKCHAIN CONFIGURATION
// =============================================================================

export const CHAIN_CONFIG = {
  // Polygon Mainnet
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  // Polygon Amoy Testnet
  amoy: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
} as const;

// Default to testnet for development
export const DEFAULT_CHAIN = 'amoy' as const;

// =============================================================================
// CONTRACT ADDRESSES (to be set via ENV in production)
// =============================================================================

export const CONTRACT_ADDRESSES = {
  // ERC-1155 Sticker Contract
  stickers: '0x0000000000000000000000000000000000000000',
  // Pack Contract (handles purchases and VRF)
  packs: '0x0000000000000000000000000000000000000000',
  // Craft Contract (burn/mint logic)
  craft: '0x0000000000000000000000000000000000000000',
  // Rewards Contract (badge claims)
  rewards: '0x0000000000000000000000000000000000000000',
} as const;

// =============================================================================
// ALBUM CONFIGURATION
// =============================================================================

export const ALBUM_CONFIG = {
  season: 1,
  totalStickers: 300,
  totalPages: 10,
  stickersPerPage: 30,
  gridColumns: 10,
  gridRows: 3,
} as const;

// =============================================================================
// RARITY CONFIGURATION
// =============================================================================

export const RARITY_CONFIG = {
  common: {
    name: 'Common',
    color: 'slate',
    cssClass: 'rarity-common',
    probability: 0.70,
    craftValue: 1,
  },
  rare: {
    name: 'Rare',
    color: 'blue',
    cssClass: 'rarity-rare',
    probability: 0.22,
    craftValue: 5,
  },
  epic: {
    name: 'Epic',
    color: 'purple',
    cssClass: 'rarity-epic',
    probability: 0.07,
    craftValue: 20,
  },
  legendary: {
    name: 'Legendary',
    color: 'yellow',
    cssClass: 'rarity-legendary',
    probability: 0.01,
    craftValue: 60,
  },
} as const;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UI_CONFIG = {
  // Animation durations (ms)
  animations: {
    packShake: 500,
    packOpen: 800,
    cardReveal: 600,
    cardRevealDelay: 200, // Delay between each card reveal
    confettiDuration: 3000,
  },
  // Toast durations (ms)
  toasts: {
    success: 4000,
    error: 6000,
    info: 3000,
  },
  // Pagination
  pagination: {
    defaultPageSize: 30,
    inventoryPageSize: 50,
    historyPageSize: 20,
  },
  // Virtual list settings
  virtualList: {
    itemHeight: 200,
    overscan: 5,
  },
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  theme: 'nft-album-theme',
  recentOpenings: 'nft-album-recent-openings',
  favoriteStickers: 'nft-album-favorites',
  onboardingComplete: 'nft-album-onboarding',
  language: 'nft-album-language',
} as const;

// =============================================================================
// API ENDPOINTS (for future backend integration)
// =============================================================================

export const API_ENDPOINTS = {
  metadata: '/api/metadata',
  history: '/api/history',
  ranking: '/api/ranking',
  simulate: '/api/simulate',
} as const;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  craftingEnabled: true,
  rewardsEnabled: true,
  tradingEnabled: false, // Coming soon
  rankingEnabled: true,
  vrfEnabled: true, // Chainlink VRF integration
  analyticsEnabled: false,
} as const;

// =============================================================================
// ADMIN CONFIGURATION
// =============================================================================

// Admin wallet addresses (lowercase for comparison)
export const ADMIN_WALLETS: string[] = [
  // Add admin wallet addresses here
  // '0x...',
];

/**
 * Check if an address is an admin
 */
export function isAdminAddress(address: string | undefined): boolean {
  if (!address) return false;
  return ADMIN_WALLETS.includes(address.toLowerCase());
}
