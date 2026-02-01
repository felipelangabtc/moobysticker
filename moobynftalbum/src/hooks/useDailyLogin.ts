/**
 * Daily Login Hook
 * Manages daily login rewards state and claiming logic
 */

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import {
  DAILY_LOGIN_STORAGE_KEY,
  DAILY_REWARDS_SCHEDULE,
  DAILY_PACK_CONFIG,
  getTodayDateString,
  isYesterday,
  isToday,
  type DailyLoginData,
} from '@/config/dailyRewards';
import type { Rarity } from '@/data/stickers';

// OG Contract for NFT check
const OG_CONTRACT_ADDRESS = '0x5437cb222601ac473f4fb11dc1b238452962c1ca' as const;

const ERC721_BALANCE_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Default state
const DEFAULT_LOGIN_DATA: DailyLoginData = {
  lastClaimDate: null,
  currentDay: 1,
  streak: 0,
};

// Load from localStorage
function loadLoginData(): DailyLoginData {
  try {
    const stored = localStorage.getItem(DAILY_LOGIN_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading daily login data:', e);
  }
  return DEFAULT_LOGIN_DATA;
}

// Save to localStorage
function saveLoginData(data: DailyLoginData): void {
  try {
    localStorage.setItem(DAILY_LOGIN_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving daily login data:', e);
  }
}

// Generate random stickers based on rarity chances
function generateRandomStickers(
  count: number,
  rarityChances: Record<string, number>,
  isOGHolder: boolean
): number[] {
  const stickers: number[] = [];
  const rarities: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let cumulative = 0;
    let selectedRarity: Rarity = 'common';

    for (const rarity of rarities) {
      cumulative += rarityChances[rarity] || 0;
      if (roll <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    // Generate sticker ID based on rarity and type
    // Regular stickers: 1-300, OG stickers: 1001-1050
    let stickerId: number;
    
    if (isOGHolder && Math.random() < 0.3) {
      // 30% chance of OG sticker for OG holders
      stickerId = 1001 + Math.floor(Math.random() * 50);
    } else {
      // Regular sticker (influenced by rarity)
      // Different ID ranges could represent different rarities
      const baseId = Math.floor(Math.random() * 300) + 1;
      stickerId = baseId;
    }

    stickers.push(stickerId);
  }

  return stickers;
}

export interface UseDailyLoginReturn {
  isOGHolder: boolean;
  isCheckingNFT: boolean;
  currentDay: number;
  streak: number;
  canClaimToday: boolean;
  hasClaimedToday: boolean;
  todayReward: { packs: number; stickersPerPack: number; totalStickers: number };
  weekProgress: { day: number; packs: number; claimed: boolean; isToday: boolean }[];
  claimReward: () => number[]; // Returns sticker IDs
  packType: 'regular' | 'og';
}

export function useDailyLogin(): UseDailyLoginReturn {
  const { address, isConnected } = useAccount();
  const [loginData, setLoginData] = useState<DailyLoginData>(DEFAULT_LOGIN_DATA);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check NFT ownership
  const { data: balance, isLoading: isCheckingNFT } = useReadContract({
    address: OG_CONTRACT_ADDRESS,
    abi: ERC721_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const isOGHolder = balance !== undefined && balance > 0n;
  const packType = isOGHolder ? 'og' : 'regular';
  const packConfig = DAILY_PACK_CONFIG[packType];

  // Initialize login data on mount
  useEffect(() => {
    const data = loadLoginData();
    
    // Check if streak should be reset
    if (data.lastClaimDate) {
      if (!isToday(data.lastClaimDate) && !isYesterday(data.lastClaimDate)) {
        // Streak broken - reset to day 1
        setLoginData({
          ...DEFAULT_LOGIN_DATA,
          currentDay: 1,
        });
      } else {
        setLoginData(data);
      }
    } else {
      setLoginData(data);
    }
    
    setIsInitialized(true);
  }, []);

  const hasClaimedToday = loginData.lastClaimDate ? isToday(loginData.lastClaimDate) : false;
  const canClaimToday = isConnected && isInitialized && !hasClaimedToday;

  const currentDayReward = DAILY_REWARDS_SCHEDULE[loginData.currentDay - 1] || DAILY_REWARDS_SCHEDULE[0];
  const todayReward = {
    packs: currentDayReward.packs,
    stickersPerPack: packConfig.stickersPerPack,
    totalStickers: currentDayReward.packs * packConfig.stickersPerPack,
  };

  // Week progress for UI
  const weekProgress = DAILY_REWARDS_SCHEDULE.map((day, index) => {
    const dayNum = index + 1;
    const isClaimed = dayNum < loginData.currentDay || (dayNum === loginData.currentDay && hasClaimedToday);
    const isDayToday = dayNum === loginData.currentDay && !hasClaimedToday;
    
    return {
      day: dayNum,
      packs: day.packs,
      claimed: isClaimed,
      isToday: isDayToday,
    };
  });

  const claimReward = useCallback(() => {
    if (!canClaimToday) return [];

    const totalStickers = currentDayReward.packs * packConfig.stickersPerPack;
    const stickers = generateRandomStickers(
      totalStickers,
      packConfig.rarityChances,
      isOGHolder
    );

    // Update login data
    const nextDay = loginData.currentDay >= 7 ? 1 : loginData.currentDay + 1;
    const newData: DailyLoginData = {
      lastClaimDate: getTodayDateString(),
      currentDay: nextDay,
      streak: loginData.streak + 1,
    };

    setLoginData(newData);
    saveLoginData(newData);

    return stickers;
  }, [canClaimToday, currentDayReward.packs, packConfig, isOGHolder, loginData]);

  return {
    isOGHolder,
    isCheckingNFT,
    currentDay: loginData.currentDay,
    streak: loginData.streak,
    canClaimToday,
    hasClaimedToday,
    todayReward,
    weekProgress,
    claimReward,
    packType,
  };
}
