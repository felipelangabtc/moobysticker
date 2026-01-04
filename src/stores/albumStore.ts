/**
 * Album Store - Zustand state management
 * Manages user's sticker collection, progress, and local state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rarity, Sticker } from '@/data/stickers';
import { SEASON_1_STICKERS, STICKERS_BY_ID, TOTAL_STICKERS, TOTAL_PAGES, STICKERS_PER_PAGE } from '@/data/stickers';
import { STORAGE_KEYS } from '@/config/constants';

// =============================================================================
// TYPES
// =============================================================================

export interface StickerBalance {
  /** Token ID */
  id: number;
  /** Quantity owned */
  quantity: number;
}

export interface PackOpening {
  /** Unique opening ID */
  id: string;
  /** Timestamp */
  timestamp: number;
  /** Pack type */
  packType: 'basic' | 'silver' | 'gold';
  /** Stickers received */
  stickers: number[];
  /** Transaction hash */
  txHash?: string;
}

export interface AlbumProgress {
  /** Total unique stickers collected */
  totalCollected: number;
  /** Progress percentage (0-100) */
  percentage: number;
  /** Per-page progress */
  pages: PageProgress[];
  /** Per-rarity counts */
  rarityBreakdown: Record<Rarity, number>;
}

export interface PageProgress {
  page: number;
  collected: number;
  total: number;
  isComplete: boolean;
}

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface AlbumStore {
  // Wallet state
  connectedAddress: string | null;
  
  // Sticker balances (token ID -> quantity)
  balances: Map<number, number>;
  
  // Recent pack openings (local cache)
  recentOpenings: PackOpening[];
  
  // Loading states
  isLoadingBalances: boolean;
  
  // Computed: Album progress
  getProgress: () => AlbumProgress;
  
  // Computed: Get sticker with balance
  getStickerWithBalance: (id: number) => (Sticker & { quantity: number }) | null;
  
  // Computed: Get page stickers with balances
  getPageStickers: (page: number) => (Sticker & { quantity: number })[];
  
  // Computed: Get duplicates (quantity > 1)
  getDuplicates: () => (Sticker & { quantity: number })[];
  
  // Computed: Get stickers by rarity with balances
  getStickersByRarity: (rarity: Rarity) => (Sticker & { quantity: number })[];
  
  // Actions
  setConnectedAddress: (address: string | null) => void;
  setBalances: (balances: Map<number, number>) => void;
  updateBalance: (tokenId: number, quantity: number) => void;
  addPackOpening: (opening: PackOpening) => void;
  setLoadingBalances: (loading: boolean) => void;
  clearRecentOpenings: () => void;
  
  // Mock actions for demo
  mockAddStickers: (stickerIds: number[]) => void;
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set, get) => ({
      // Initial state
      connectedAddress: null,
      balances: new Map(),
      recentOpenings: [],
      isLoadingBalances: false,

      // Computed: Get overall album progress
      getProgress: () => {
        const balances = get().balances;
        let totalCollected = 0;
        const rarityBreakdown: Record<Rarity, number> = {
          common: 0,
          rare: 0,
          epic: 0,
          legendary: 0,
        };

        const pages: PageProgress[] = [];

        for (let page = 1; page <= TOTAL_PAGES; page++) {
          let pageCollected = 0;

          for (let slot = 1; slot <= STICKERS_PER_PAGE; slot++) {
            const id = (page - 1) * STICKERS_PER_PAGE + slot;
            const quantity = balances.get(id) || 0;

            if (quantity > 0) {
              totalCollected++;
              pageCollected++;

              const sticker = STICKERS_BY_ID.get(id);
              if (sticker) {
                rarityBreakdown[sticker.rarity]++;
              }
            }
          }

          pages.push({
            page,
            collected: pageCollected,
            total: STICKERS_PER_PAGE,
            isComplete: pageCollected === STICKERS_PER_PAGE,
          });
        }

        return {
          totalCollected,
          percentage: Math.round((totalCollected / TOTAL_STICKERS) * 100),
          pages,
          rarityBreakdown,
        };
      },

      // Computed: Get single sticker with balance
      getStickerWithBalance: (id: number) => {
        const sticker = STICKERS_BY_ID.get(id);
        if (!sticker) return null;

        return {
          ...sticker,
          quantity: get().balances.get(id) || 0,
        };
      },

      // Computed: Get all stickers for a page with balances
      getPageStickers: (page: number) => {
        const balances = get().balances;
        const stickers: (Sticker & { quantity: number })[] = [];

        for (let slot = 1; slot <= STICKERS_PER_PAGE; slot++) {
          const id = (page - 1) * STICKERS_PER_PAGE + slot;
          const sticker = STICKERS_BY_ID.get(id);

          if (sticker) {
            stickers.push({
              ...sticker,
              quantity: balances.get(id) || 0,
            });
          }
        }

        return stickers;
      },

      // Computed: Get all duplicates (stickers with quantity > 1)
      getDuplicates: () => {
        const balances = get().balances;
        const duplicates: (Sticker & { quantity: number })[] = [];

        balances.forEach((quantity, id) => {
          if (quantity > 1) {
            const sticker = STICKERS_BY_ID.get(id);
            if (sticker) {
              duplicates.push({ ...sticker, quantity });
            }
          }
        });

        return duplicates.sort((a, b) => b.quantity - a.quantity);
      },

      // Computed: Get stickers by rarity
      getStickersByRarity: (rarity: Rarity) => {
        const balances = get().balances;
        return SEASON_1_STICKERS
          .filter(s => s.rarity === rarity)
          .map(s => ({
            ...s,
            quantity: balances.get(s.id) || 0,
          }));
      },

      // Actions
      setConnectedAddress: (address) => {
        set({ connectedAddress: address });
        if (!address) {
          set({ balances: new Map() });
        }
      },

      setBalances: (balances) => set({ balances }),

      updateBalance: (tokenId, quantity) => {
        set((state) => {
          const newBalances = new Map(state.balances);
          if (quantity > 0) {
            newBalances.set(tokenId, quantity);
          } else {
            newBalances.delete(tokenId);
          }
          return { balances: newBalances };
        });
      },

      addPackOpening: (opening) => {
        set((state) => ({
          recentOpenings: [opening, ...state.recentOpenings].slice(0, 50),
        }));
      },

      setLoadingBalances: (loading) => set({ isLoadingBalances: loading }),

      clearRecentOpenings: () => set({ recentOpenings: [] }),

      // Mock action for demo purposes
      mockAddStickers: (stickerIds: number[]) => {
        set((state) => {
          const newBalances = new Map(state.balances);
          stickerIds.forEach((id) => {
            const current = newBalances.get(id) || 0;
            newBalances.set(id, current + 1);
          });
          return { balances: newBalances };
        });
      },
    }),
    {
      name: STORAGE_KEYS.recentOpenings,
      partialize: (state) => ({
        recentOpenings: state.recentOpenings,
      }),
      // Custom serialization for Map
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            state: {
              ...parsed.state,
              balances: new Map(parsed.state.balances || []),
            },
          };
        },
        setItem: (name, value) => {
          const toStore = {
            ...value,
            state: {
              ...value.state,
              balances: Array.from(value.state.balances?.entries() || []),
            },
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// =============================================================================
// SELECTORS (for performance optimization)
// =============================================================================

export const selectProgress = (state: AlbumStore) => state.getProgress();
export const selectBalances = (state: AlbumStore) => state.balances;
export const selectIsLoading = (state: AlbumStore) => state.isLoadingBalances;
export const selectRecentOpenings = (state: AlbumStore) => state.recentOpenings;
