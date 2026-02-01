/**
 * Daily Login Rewards Component
 * Displays 7-day reward cycle with claim functionality
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDailyLogin } from '@/hooks/useDailyLogin';
import { useAlbumStore } from '@/stores/albumStore';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Calendar, 
  Gift, 
  Crown, 
  CheckCircle, 
  Lock, 
  Sparkles,
  Package,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { DAILY_PACK_CONFIG } from '@/config/dailyRewards';
import { PackOpening } from '@/components/features/packs/PackOpening';

interface DailyLoginRewardsProps {
  className?: string;
}

export function DailyLoginRewards({ className }: DailyLoginRewardsProps) {
  const { isConnected } = useAccount();
  const mockAddStickers = useAlbumStore((state) => state.mockAddStickers);
  const [openingPack, setOpeningPack] = useState<{ type: string; stickers: number[] } | null>(null);
  
  const {
    isOGHolder,
    isCheckingNFT,
    currentDay,
    streak,
    canClaimToday,
    hasClaimedToday,
    todayReward,
    weekProgress,
    claimReward,
    packType,
  } = useDailyLogin();

  const packConfig = DAILY_PACK_CONFIG[packType];

  const handleClaim = () => {
    const stickers = claimReward();
    if (stickers.length > 0) {
      setOpeningPack({ type: packType === 'og' ? 'og-daily' : 'daily', stickers });
      toast.success(`${packConfig.name} claimed! Day ${currentDay} complete!`);
    }
  };

  const handleOpeningComplete = () => {
    if (openingPack) {
      mockAddStickers(openingPack.stickers);
    }
  };

  const handleOpeningClose = () => {
    setOpeningPack(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('relative overflow-hidden rounded-2xl border', className)}
        style={{
          background: isOGHolder 
            ? 'linear-gradient(135deg, hsl(45 100% 20% / 0.3), hsl(35 100% 25% / 0.2))' 
            : 'linear-gradient(135deg, hsl(220 70% 20% / 0.3), hsl(260 60% 25% / 0.2))',
          borderColor: isOGHolder ? 'hsl(45 100% 50% / 0.3)' : 'hsl(220 70% 50% / 0.3)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className={cn('h-5 w-5', isOGHolder ? 'text-yellow-400' : 'text-blue-400')} />
            <h3 className="font-display text-lg font-bold">Daily Rewards</h3>
            {isOGHolder && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                <Crown className="h-3 w-3" />
                OG
              </span>
            )}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{streak} day streak</span>
            </div>
          )}
        </div>

        {/* 7-Day Progress */}
        <div className="p-4">
          <div className="mb-4 grid grid-cols-7 gap-2">
            {weekProgress.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative flex flex-col items-center rounded-lg p-2 transition-all',
                  day.claimed 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : day.isToday 
                      ? isOGHolder 
                        ? 'bg-yellow-500/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20' 
                        : 'bg-blue-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 border border-white/10'
                )}
              >
                {/* Day number */}
                <span className={cn(
                  'text-xs font-semibold',
                  day.claimed ? 'text-green-400' : day.isToday ? (isOGHolder ? 'text-yellow-400' : 'text-blue-400') : 'text-muted-foreground'
                )}>
                  Day {day.day}
                </span>

                {/* Icon */}
                <div className="my-1">
                  {day.claimed ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : day.isToday ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Gift className={cn('h-5 w-5', isOGHolder ? 'text-yellow-400' : 'text-blue-400')} />
                    </motion.div>
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground/50" />
                  )}
                </div>

                {/* Packs count */}
                <span className={cn(
                  'text-[10px]',
                  day.claimed ? 'text-green-400/70' : day.isToday ? 'text-white' : 'text-muted-foreground'
                )}>
                  {day.packs}x
                </span>

                {/* Today indicator */}
                {day.isToday && (
                  <motion.div
                    className={cn(
                      'absolute -top-1 -right-1 h-3 w-3 rounded-full',
                      isOGHolder ? 'bg-yellow-400' : 'bg-blue-400'
                    )}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Today's Reward Info */}
          <div className={cn(
            'mb-4 rounded-xl p-4',
            isOGHolder ? 'bg-yellow-500/10' : 'bg-blue-500/10'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Reward</p>
                <p className={cn('text-lg font-bold', isOGHolder ? 'text-yellow-400' : 'text-blue-400')}>
                  {todayReward.packs}x {packConfig.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {todayReward.totalStickers} stickers total
                  {isOGHolder && ' • Better rarity chances'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(todayReward.packs)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                  >
                    <Package className={cn('h-8 w-8', isOGHolder ? 'text-yellow-400' : 'text-blue-400')} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Claim Button */}
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={openConnectModal}
                  className={cn(
                    'w-full',
                    isOGHolder 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  )}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet to Claim
                </Button>
              )}
            </ConnectButton.Custom>
          ) : hasClaimedToday ? (
            <Button disabled className="w-full bg-green-500/20 text-green-400">
              <CheckCircle className="mr-2 h-4 w-4" />
              Claimed Today! Come back tomorrow
            </Button>
          ) : (
            <Button
              onClick={handleClaim}
              disabled={!canClaimToday || isCheckingNFT}
              className={cn(
                'w-full',
                isOGHolder 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              )}
            >
              <Gift className="mr-2 h-4 w-4" />
              Claim Day {currentDay} Reward
            </Button>
          )}

          {/* Pack Type Info */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {isOGHolder ? (
              <>
                <Crown className="mr-1 inline h-3 w-3 text-yellow-400" />
                OG Holder: 4 stickers/pack with improved rarity
              </>
            ) : (
              <>
                <Package className="mr-1 inline h-3 w-3" />
                Regular: 2 stickers/pack • Hold OG NFT for better rewards
              </>
            )}
          </p>
        </div>
      </motion.div>

      {/* Pack Opening Animation */}
      {openingPack && (
        <PackOpening
          packType={openingPack.type as any}
          stickerIds={openingPack.stickers}
          onComplete={handleOpeningComplete}
          onClose={handleOpeningClose}
        />
      )}
    </>
  );
}
