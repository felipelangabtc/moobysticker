/**
 * OpenSea Integration Utilities
 * Helper functions for OpenSea marketplace integration
 */

import { getOpenSeaConfig, getContractAddress } from '@/config/contracts';

// =============================================================================
// URL GENERATION
// =============================================================================

/**
 * Get OpenSea URL for a specific sticker NFT
 */
export function getOpenSeaAssetUrl(stickerId: number, chainId: number = 80002): string {
  const config = getOpenSeaConfig(chainId);
  const contracts = getContractAddress(chainId);
  
  if (contracts.stickers === '0x0000000000000000000000000000000000000000') {
    return '#'; // Contract not deployed
  }
  
  return config.assetUrl(contracts.stickers, stickerId);
}

/**
 * Get OpenSea URL for the entire collection
 */
export function getOpenSeaCollectionUrl(chainId: number = 80002): string {
  const config = getOpenSeaConfig(chainId);
  const contracts = getContractAddress(chainId);
  
  if (contracts.stickers === '0x0000000000000000000000000000000000000000') {
    return '#';
  }
  
  return config.collectionUrl(contracts.stickers);
}

// =============================================================================
// METADATA GENERATION
// =============================================================================

interface StickerMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  properties: {
    files: { uri: string; type: string }[];
    category: string;
  };
}

/**
 * Generate OpenSea-compatible metadata for a sticker
 */
export function generateStickerMetadata(
  stickerId: number,
  name: string,
  rarity: string,
  imageIpfsHash: string,
  collection: 'season1' | 'og'
): StickerMetadata {
  const rarityColors: Record<string, string> = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
  };

  return {
    name: `${name} #${stickerId}`,
    description: `A ${rarity} sticker from the Mooby Stickers ${collection === 'og' ? 'OG' : 'Season 1'} collection. Collect, trade, and complete your digital sticker album!`,
    image: `ipfs://${imageIpfsHash}`,
    external_url: `https://moobynftalbum.lovable.app/sticker/${stickerId}`,
    attributes: [
      {
        trait_type: 'Rarity',
        value: rarity.charAt(0).toUpperCase() + rarity.slice(1),
      },
      {
        trait_type: 'Collection',
        value: collection === 'og' ? 'OG Collection' : 'Season 1',
      },
      {
        trait_type: 'Sticker ID',
        value: stickerId,
      },
      {
        trait_type: 'Background Color',
        value: rarityColors[rarity] || '#9CA3AF',
      },
    ],
    properties: {
      files: [
        {
          uri: `ipfs://${imageIpfsHash}`,
          type: 'image/png',
        },
      ],
      category: 'collectible',
    },
  };
}

/**
 * Generate collection-level metadata for OpenSea
 */
export function generateCollectionMetadata(
  imageIpfsHash: string,
  bannerIpfsHash: string
) {
  return {
    name: 'Mooby Stickers Season 1',
    description: 'Collect, trade, and complete your digital sticker album on Polygon! 300 unique stickers across Common, Rare, Epic, and Legendary rarities. Plus 50 exclusive OG stickers for early supporters.',
    image: `ipfs://${imageIpfsHash}`,
    banner_image: `ipfs://${bannerIpfsHash}`,
    external_link: 'https://moobynftalbum.lovable.app',
    seller_fee_basis_points: 250, // 2.5% royalty
    fee_recipient: '', // Set to your royalty address
    discord: '',
    twitter: '',
  };
}

// =============================================================================
// TRADING
// =============================================================================

/**
 * Open OpenSea listing page for a sticker
 */
export function openOpenSeaListing(stickerId: number, chainId: number = 80002): void {
  const url = getOpenSeaAssetUrl(stickerId, chainId);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Open OpenSea collection page
 */
export function openOpenSeaCollection(chainId: number = 80002): void {
  const url = getOpenSeaCollectionUrl(chainId);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
