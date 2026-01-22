/**
 * Marketplace Store - Zustand state management
 * Manages NFT listings, sales history, and marketplace state
 * Updated: Sales tracking with trends
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rarity } from '@/data/stickers';

// =============================================================================
// TYPES
// =============================================================================

export interface MarketplaceListing {
  id: string;
  stickerId: number;
  stickerName: string;
  stickerImageUrl: string;
  rarity: Rarity;
  price: string; // Price in MATIC
  seller: string;
  sellerDisplay: string;
  listedAt: number;
  isOG: boolean;
}

export interface SaleRecord {
  id: string;
  stickerId: number;
  stickerName: string;
  stickerImageUrl: string;
  rarity: Rarity;
  price: string;
  seller: string;
  sellerDisplay: string;
  buyer: string;
  buyerDisplay: string;
  soldAt: number;
  isOG: boolean;
}

interface MarketplaceState {
  listings: MarketplaceListing[];
  salesHistory: SaleRecord[];
}

interface MarketplaceActions {
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'listedAt'>) => void;
  removeListing: (listingId: string) => void;
  buyListing: (listingId: string, buyer: string) => MarketplaceListing | null;
  getUserListings: (address: string) => MarketplaceListing[];
  clearUserListings: (address: string) => void;
  clearSalesHistory: () => void;
}

type MarketplaceStore = MarketplaceState & MarketplaceActions;

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    (set, get) => ({
      // Initial state
      listings: [],
      salesHistory: [],

      // Actions
      addListing: (listing) => {
        const newListing: MarketplaceListing = {
          ...listing,
          id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          listedAt: Date.now(),
        };

        set((state) => ({
          listings: [newListing, ...state.listings],
        }));
      },

      removeListing: (listingId) => {
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== listingId),
        }));
      },

      buyListing: (listingId, buyer) => {
        const listing = get().listings.find((l) => l.id === listingId);
        if (!listing) return null;

        // Create sale record
        const saleRecord: SaleRecord = {
          id: `sale_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          stickerId: listing.stickerId,
          stickerName: listing.stickerName,
          stickerImageUrl: listing.stickerImageUrl,
          rarity: listing.rarity,
          price: listing.price,
          seller: listing.seller,
          sellerDisplay: listing.sellerDisplay,
          buyer: buyer,
          buyerDisplay: `${buyer.slice(0, 6)}...${buyer.slice(-4)}`,
          soldAt: Date.now(),
          isOG: listing.isOG,
        };

        // Remove from listings and add to sales history
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== listingId),
          salesHistory: [saleRecord, ...state.salesHistory].slice(0, 100), // Keep last 100 sales
        }));

        return listing;
      },

      getUserListings: (address) => {
        return get().listings.filter(
          (l) => l.seller.toLowerCase() === address.toLowerCase()
        );
      },

      clearUserListings: (address) => {
        set((state) => ({
          listings: state.listings.filter(
            (l) => l.seller.toLowerCase() !== address.toLowerCase()
          ),
        }));
      },

      clearSalesHistory: () => {
        set({ salesHistory: [] });
      },
    }),
    {
      name: 'mooby-marketplace',
      partialize: (state) => ({
        listings: state.listings,
        salesHistory: state.salesHistory,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const useListings = () => useMarketplaceStore((state) => state.listings);

export const useSalesHistory = () => useMarketplaceStore((state) => state.salesHistory);

export const useListingsByRarity = (rarity: Rarity | 'all') =>
  useMarketplaceStore((state) =>
    rarity === 'all'
      ? state.listings
      : state.listings.filter((l) => l.rarity === rarity)
  );

// Helper function to calculate stats (not a hook - used inside useMemo)
export function calculateSalesStats(salesHistory: SaleRecord[]) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const sales24h = salesHistory.filter((s) => s.soldAt >= oneDayAgo);
  const salesWeek = salesHistory.filter((s) => s.soldAt >= oneWeekAgo);

  const volume24h = sales24h.reduce((sum, s) => sum + parseFloat(s.price), 0);
  const volumeWeek = salesWeek.reduce((sum, s) => sum + parseFloat(s.price), 0);

  // Average prices by rarity
  const avgPrices: Record<Rarity, { avg: number; count: number }> = {
    common: { avg: 0, count: 0 },
    rare: { avg: 0, count: 0 },
    epic: { avg: 0, count: 0 },
    legendary: { avg: 0, count: 0 },
  };

  salesWeek.forEach((s) => {
    avgPrices[s.rarity].avg += parseFloat(s.price);
    avgPrices[s.rarity].count++;
  });

  Object.keys(avgPrices).forEach((rarity) => {
    const r = rarity as Rarity;
    if (avgPrices[r].count > 0) {
      avgPrices[r].avg = avgPrices[r].avg / avgPrices[r].count;
    }
  });

  return {
    totalSales: salesHistory.length,
    sales24h: sales24h.length,
    salesWeek: salesWeek.length,
    volume24h,
    volumeWeek,
    avgPrices,
  };
}
