/**
 * OG Holder Pack Card Component
 * Special pack that can only be claimed by holders of the OG NFT collection
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, Lock, Wallet } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// OG Collection Contract Address
const OG_CONTRACT_ADDRESS = '0x5437cb222601ac473f4fb11dc1b238452962c1ca' as const;

// Simplified ERC721 ABI for balanceOf check
const ERC721_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

interface OGHolderPackCardProps {
  onClaim?: () => void;
  hasClaimed?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function OGHolderPackCard({
  onClaim,
  hasClaimed = false,
  isLoading = false,
  className,
}: OGHolderPackCardProps) {
  const { address, isConnected } = useAccount();

  // Check if user holds the OG NFT
  const { data: balance, isLoading: isCheckingBalance } = useReadContract({
    address: OG_CONTRACT_ADDRESS,
    abi: ERC721_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const isHolder = balance !== undefined && balance > 0n;
  const canClaim = isConnected && isHolder && !hasClaimed;

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

        {/* Description */}
        <p className="mb-4 text-center text-sm text-white/80">
          Exclusive pack for OG NFT holders. Contains 5 guaranteed OG stickers!
        </p>

        {/* Price / Free label */}
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-white">FREE CLAIM</span>
          <p className="text-xs text-white/60">For verified holders only</p>
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
          ) : hasClaimed ? (
            <span className="flex items-center justify-center gap-2 text-sm text-green-300">
              <CheckCircle className="h-4 w-4" />
              Already claimed!
            </span>
          ) : isHolder ? (
            <span className="flex items-center justify-center gap-2 text-sm text-green-300">
              <CheckCircle className="h-4 w-4" />
              Eligible! You own {balance?.toString()} OG NFT(s)
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-sm text-red-300">
              <Lock className="h-4 w-4" />
              Not eligible - No OG NFT found
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
              onClick={onClaim}
              disabled={!canClaim || isLoading || isCheckingBalance}
              className={cn(
                'flex-1',
                canClaim
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'cursor-not-allowed bg-white/30 text-white/60'
              )}
            >
              {isLoading ? 'Claiming...' : hasClaimed ? 'Claimed' : isHolder ? 'Claim Pack' : 'Not Eligible'}
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
