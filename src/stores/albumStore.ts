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
  id: number;
  quantity: number;
}

export interface PackOpening {
  id: string;
  timestamp: number;
  packType: 'basic' | 'silver' | 'gold';
  stickers: number[];
  txHash?: string;
}

export interface AlbumProgress {
  totalCollected: number;
  percentage: number;
  pages: PageProgress[];
  rarityBreakdown: Record<Rarity, number>;
}

export interface PageProgress {
  page: number;
  collected: number;
  total: number;
  isComplete: boolean;
}

// =============================================================================
// HELPER FUNCTIONS (outside store to prevent re-renders)
// =============================================================================

function calculateProgress(balances: Record<number, number>): AlbumProgress {
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
      const quantity = balances[id] || 0;

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
}

function getPageStickersHelper(page: number, balances: Record<number, number>): (Sticker & { quantity: number })[] {
  const stickers: (Sticker & { quantity: number })[] = [];

  for (let slot = 1; slot <= STICKERS_PER_PAGE; slot++) {
    const id = (page - 1) * STICKERS_PER_PAGE + slot;
    const sticker = STICKERS_BY_ID.get(id);

    if (sticker) {
      stickers.push({
        ...sticker,
        quantity: balances[id] || 0,
      });
    }
  }

  return stickers;
}

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface AlbumState {
  connectedAddress: string | null;
  balances: Record<number, number>;
  recentOpenings: PackOpening[];
  isLoadingBalances: boolean;
}

interface AlbumActions {
  setConnectedAddress: (address: string | null) => void;
  setBalances: (balances: Record<number, number>) => void;
  updateBalance: (tokenId: number, quantity: number) => void;
  addPackOpening: (opening: PackOpening) => void;
  setLoadingBalances: (loading: boolean) => void;
  clearRecentOpenings: () => void;
  mockAddStickers: (stickerIds: number[]) => void;
}

type AlbumStore = AlbumState & AlbumActions;

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set) => ({
      // Initial state
      connectedAddress: null,
      balances: {},
      recentOpenings: [],
      isLoadingBalances: false,

      // Actions
      setConnectedAddress: (address) => {
        set({ connectedAddress: address });
        if (!address) {
          set({ balances: {} });
        }
      },

      setBalances: (balances) => set({ balances }),

      updateBalance: (tokenId, quantity) => {
        set((state) => {
          const newBalances = { ...state.balances };
          if (quantity > 0) {
            newBalances[tokenId] = quantity;
          } else {
            delete newBalances[tokenId];
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

      mockAddStickers: (stickerIds: number[]) => {
        set((state) => {
          const newBalances = { ...state.balances };
          stickerIds.forEach((id) => {
            const current = newBalances[id] || 0;
            newBalances[id] = current + 1;
          });
          return { balances: newBalances };
        });
      },
    }),
    {
      name: STORAGE_KEYS.recentOpenings,
      partialize: (state) => ({
        recentOpenings: state.recentOpenings,
        balances: state.balances,
        connectedAddress: state.connectedAddress,
      }),
    }
  )
);

// =============================================================================
// SELECTORS (use these to avoid re-renders)
// =============================================================================

export const useProgress = () => {
  const balances = useAlbumStore((state) => state.balances);
  return calculateProgress(balances);
};

export const usePageStickers = (page: number) => {
  const balances = useAlbumStore((state) => state.balances);
  return getPageStickersHelper(page, balances);
};

export const useStickerWithBalance = (id: number) => {
  const balances = useAlbumStore((state) => state.balances);
  const sticker = STICKERS_BY_ID.get(id);
  if (!sticker) return null;
  return { ...sticker, quantity: balances[id] || 0 };
};

export const useDuplicates = () => {
  const balances = useAlbumStore((state) => state.balances);
  const duplicates: (Sticker & { quantity: number })[] = [];

  Object.entries(balances).forEach(([idStr, quantity]) => {
    const id = parseInt(idStr);
    if (quantity > 1) {
      const sticker = STICKERS_BY_ID.get(id);
      if (sticker) {
        duplicates.push({ ...sticker, quantity });
      }
    }
  });

  return duplicates.sort((a, b) => b.quantity - a.quantity);
};
