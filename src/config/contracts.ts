/**
 * Smart Contract Configuration
 * Update these addresses after deploying contracts
 */

// =============================================================================
// CONTRACT ADDRESSES
// =============================================================================

export const CONTRACT_ADDRESSES = {
  // Polygon Amoy Testnet
  amoy: {
    // ERC-1155 Sticker Contract - UPDATE AFTER DEPLOYMENT
    stickers: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    // OG NFT Contract for holder verification
    ogNft: '0x5437cb222601ac473f4fb11dc1b238452962c1ca' as `0x${string}`,
  },
  // Polygon Mainnet (for production)
  polygon: {
    stickers: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    ogNft: '0x5437cb222601ac473f4fb11dc1b238452962c1ca' as `0x${string}`,
  },
} as const;

// =============================================================================
// METADATA CONFIGURATION
// =============================================================================

export const METADATA_CONFIG = {
  // IPFS Gateway for metadata
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs/',
  // Base URI for sticker metadata (set after uploading to Pinata)
  baseUri: '',
  // Collection metadata
  collection: {
    name: 'Mooby Stickers Season 1',
    description: 'Collect, trade, and complete your digital sticker album on Polygon!',
    image: '', // IPFS hash of collection image
    external_link: 'https://moobynftalbum.lovable.app',
    seller_fee_basis_points: 250, // 2.5% royalty
    fee_recipient: '', // Royalty recipient address
  },
} as const;

// =============================================================================
// OPENSEA CONFIGURATION
// =============================================================================

export const OPENSEA_CONFIG = {
  // Polygon Amoy (testnet)
  amoy: {
    collectionUrl: (contractAddress: string) => 
      `https://testnets.opensea.io/collection/${contractAddress}`,
    assetUrl: (contractAddress: string, tokenId: number) =>
      `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`,
  },
  // Polygon Mainnet
  polygon: {
    collectionUrl: (contractAddress: string) =>
      `https://opensea.io/collection/${contractAddress}`,
    assetUrl: (contractAddress: string, tokenId: number) =>
      `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`,
  },
} as const;

// =============================================================================
// CHAIN DETECTION
// =============================================================================

export function getContractAddress(chainId: number): typeof CONTRACT_ADDRESSES.amoy {
  if (chainId === 137) {
    return CONTRACT_ADDRESSES.polygon;
  }
  return CONTRACT_ADDRESSES.amoy;
}

export function getOpenSeaConfig(chainId: number) {
  if (chainId === 137) {
    return OPENSEA_CONFIG.polygon;
  }
  return OPENSEA_CONFIG.amoy;
}

// =============================================================================
// STICKER ID VALIDATION
// =============================================================================

export const STICKER_RANGES = {
  season1: { start: 1, end: 300 },
  og: { start: 1001, end: 1050 },
} as const;

export function isValidStickerId(id: number): boolean {
  return (
    (id >= STICKER_RANGES.season1.start && id <= STICKER_RANGES.season1.end) ||
    (id >= STICKER_RANGES.og.start && id <= STICKER_RANGES.og.end)
  );
}

export function getStickerCollection(id: number): 'season1' | 'og' | null {
  if (id >= STICKER_RANGES.season1.start && id <= STICKER_RANGES.season1.end) {
    return 'season1';
  }
  if (id >= STICKER_RANGES.og.start && id <= STICKER_RANGES.og.end) {
    return 'og';
  }
  return null;
}
