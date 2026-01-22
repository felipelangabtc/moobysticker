/**
 * OG Holder Pack Card Component
 * Special pack that can only be claimed by holders of the OG NFT collection
 * Each NFT token can only claim once
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, Lock, Wallet, Package, Gift } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// OG Collection Contract Address
const OG_CONTRACT_ADDRESS = '0x5437cb222601ac473f4fb11dc1b238452962c1ca' as const;

// Storage key for claimed tokens
const OG_CLAIMS_STORAGE_KEY = 'og_holder_claimed_tokens';

// ERC721Enumerable ABI for balanceOf and tokenOfOwnerByIndex
const ERC721_ENUMERABLE_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Pack rewards configuration
export const OG_PACK_REWARDS = {
  ogStickers: 5,
  goldPacks: 1,
  silverPacks: 2,
  basicPacks: 3,
};

interface OGHolderPackCardProps {
  onClaim?: (tokenId: number) => void;
  isLoading?: boolean;
  className?: string;
}

// Helper to get claimed tokens from localStorage
function getClaimedTokens(): Set<number> {
  try {
    const stored = localStorage.getItem(OG_CLAIMS_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.error('Error reading claimed tokens:', e);
  }
  return new Set();
}

// Helper to save claimed token to localStorage
function saveClaimedToken(tokenId: number): void {
  try {
    const claimed = getClaimedTokens();
    claimed.add(tokenId);
    localStorage.setItem(OG_CLAIMS_STORAGE_KEY, JSON.stringify([...claimed]));
  } catch (e) {
    console.error('Error saving claimed token:', e);
  }
}

export function OGHolderPackCard({
  onClaim,
  isLoading = false,
  className,
}: OGHolderPackCardProps) {
  const { address, isConnected } = useAccount();
  const [claimedTokens, setClaimedTokens] = useState<Set<number>>(new Set());
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null);

  // Load claimed tokens on mount
  useEffect(() => {
    setClaimedTokens(getClaimedTokens());
  }, []);

  // Check user's NFT balance
  const { data: balance, isLoading: isCheckingBalance } = useReadContract({
    address: OG_CONTRACT_ADDRESS,
    abi: ERC721_ENUMERABLE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get first token ID owned by user (for simplicity, we check index 0)
  const { data: firstTokenId } = useReadContract({
    address: OG_CONTRACT_ADDRESS,
    abi: ERC721_ENUMERABLE_ABI,
    functionName: 'tokenOfOwnerByIndex',
    args: address && balance && balance > 0n ? [address, 0n] : undefined,
    query: {
      enabled: !!address && balance !== undefined && balance > 0n,
    },
  });

  // Calculate claimable tokens
  const tokenInfo = useMemo(() => {
    if (!balance || balance === 0n) {
      return { totalOwned: 0, claimableCount: 0, firstClaimableId: null };
    }
    
    const totalOwned = Number(balance);
    // For MVP, we just check the first token
    const tokenId = firstTokenId !== undefined ? Number(firstTokenId) : null;
    const isClaimed = tokenId !== null && claimedTokens.has(tokenId);
    
    return {
      totalOwned,
      claimableCount: isClaimed ? 0 : (tokenId !== null ? 1 : 0),
      firstClaimableId: isClaimed ? null : tokenId,
    };
  }, [balance, firstTokenId, claimedTokens]);

  const isHolder = balance !== undefined && balance > 0n;
  const canClaim = isConnected && isHolder && tokenInfo.firstClaimableId !== null;

  const handleClaim = () => {
    if (tokenInfo.firstClaimableId !== null && onClaim) {
      saveClaimedToken(tokenInfo.firstClaimableId);
      setClaimedTokens(new Set([...claimedTokens, tokenInfo.firstClaimableId]));
      onClaim(tokenInfo.firstClaimableId);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('relative', className)}
    >
      <div
        className={cn(
          'relative flex flex-col overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 transition-all duration-300',
          'from-amber-500 via-yellow-500 to-orange-600',
          'border-yellow-400',
          'hover:shadow-yellow-500/50 hover:shadow-xl'
        )}
      >
        {/* Exclusive badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs font-semibold text-yellow-300 backdrop-blur">
          <Crown className="h-3 w-3" />
          EXCLUSIVE
        </div>

        {/* Animated background particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-yellow-300/30"
              initial={{ x: Math.random() * 100 + '%', y: '100%', opacity: 0 }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Pack icon/visual */}
        <div className="relative mb-4 flex justify-center pt-4">
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="flex h-32 w-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-yellow-200/30 to-amber-500/20 shadow-lg backdrop-blur">
              <Crown className="h-12 w-12 text-yellow-300" />
              <span className="mt-2 text-3xl font-bold text-white">OG</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-60 blur-xl" />
          </motion.div>
        </div>

        {/* Pack name */}
        <h3 className="mb-1 text-center text-xl font-bold text-white">OG Holder Pack</h3>

        {/* Rewards breakdown */}
        <div className="mb-4 rounded-lg bg-black/20 p-3">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-white/60">
            Pack Contains
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-white">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-300" />
              <span>{OG_PACK_REWARDS.ogStickers} OG Stickers</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-yellow-400" />
              <span>{OG_PACK_REWARDS.goldPacks} Gold Pack</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-300" />
              <span>{OG_PACK_REWARDS.silverPacks} Silver Packs</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-300" />
              <span>{OG_PACK_REWARDS.basicPacks} Basic Packs</span>
            </div>
          </div>
        </div>

        {/* Price / Free label */}
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-white">FREE CLAIM</span>
          <p className="text-xs text-white/60">1 claim per NFT owned</p>
        </div>

        {/* Status indicator */}
        <div className="mb-4 rounded-lg bg-black/20 py-2 text-center">
          {!isConnected ? (
            <span className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Wallet className="h-4 w-4" />
              Connect wallet to verify
            </span>
          ) : isCheckingBalance ? (
            <span className="text-sm text-white/80">Checking eligibility...</span>
          ) : !isHolder ? (
            <span className="flex items-center justify-center gap-2 text-sm text-red-300">
              <Lock className="h-4 w-4" />
              Not eligible - No OG NFT found
            </span>
          ) : tokenInfo.claimableCount > 0 ? (
            <span className="flex items-center justify-center gap-2 text-sm text-green-300">
              <CheckCircle className="h-4 w-4" />
              Eligible! Token #{tokenInfo.firstClaimableId} can claim
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-sm text-yellow-300">
              <CheckCircle className="h-4 w-4" />
              All {tokenInfo.totalOwned} token(s) already claimed
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={openConnectModal}
                  className="flex-1 bg-white text-black hover:bg-white/90"
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectButton.Custom>
          ) : (
            <Button
              onClick={handleClaim}
              disabled={!canClaim || isLoading || isCheckingBalance}
              className={cn(
                'flex-1',
                canClaim
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'cursor-not-allowed bg-white/30 text-white/60'
              )}
            >
              {isLoading
                ? 'Claiming...'
                : tokenInfo.claimableCount === 0 && isHolder
                ? 'All Claimed'
                : isHolder
                ? 'Claim Pack'
                : 'Not Eligible'}
            </Button>
          )}
        </div>

        {/* Contract info */}
        <p className="mt-3 text-center text-[10px] text-white/40">
          Verified via contract: {OG_CONTRACT_ADDRESS.slice(0, 8)}...{OG_CONTRACT_ADDRESS.slice(-6)}
        </p>
      </div>
    </motion.div>
  );
}
