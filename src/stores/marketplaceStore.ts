/**
 * Marketplace Store - Zustand state management
 * Manages NFT listings and marketplace state
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

interface MarketplaceState {
  listings: MarketplaceListing[];
  userListings: MarketplaceListing[];
}

interface MarketplaceActions {
  addListing: (listing: Omit<MarketplaceListing, 'id' | 'listedAt'>) => void;
  removeListing: (listingId: string) => void;
  buyListing: (listingId: string, buyer: string) => MarketplaceListing | null;
  getUserListings: (address: string) => MarketplaceListing[];
  clearUserListings: (address: string) => void;
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
      userListings: [],

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

        // Remove from listings
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== listingId),
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
    }),
    {
      name: 'mooby-marketplace',
      partialize: (state) => ({
        listings: state.listings,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const useListings = () => useMarketplaceStore((state) => state.listings);

export const useListingsByRarity = (rarity: Rarity | 'all') =>
  useMarketplaceStore((state) =>
    rarity === 'all'
      ? state.listings
      : state.listings.filter((l) => l.rarity === rarity)
  );
