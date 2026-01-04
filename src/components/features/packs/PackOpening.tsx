/**
 * Pack Opening Animation Component
 * Handles the full pack opening experience with animations and reveals
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import type { PackType } from '@/data/packs';
import type { Sticker } from '@/data/stickers';
import { STICKERS_BY_ID } from '@/data/stickers';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import { Button } from '@/components/ui/button';
import { UI_CONFIG } from '@/config/constants';
import { Package, Loader2, Sparkles } from 'lucide-react';

type OpeningPhase = 'idle' | 'shaking' | 'opening' | 'revealing' | 'complete';

interface PackOpeningProps {
  packType: PackType;
  stickerIds: number[];
  onComplete?: () => void;
  onClose?: () => void;
}

export function PackOpening({
  packType,
  stickerIds,
  onComplete,
  onClose,
}: PackOpeningProps) {
  const [phase, setPhase] = useState<OpeningPhase>('idle');
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  const stickers = stickerIds
    .map((id) => {
      const sticker = STICKERS_BY_ID.get(id);
      return sticker ? { ...sticker, quantity: 1 } : null;
    })
    .filter(Boolean) as (Sticker & { quantity: number })[];

  // Trigger confetti for rare+ cards
  const triggerConfetti = useCallback((rarity: string) => {
    const colors =
      rarity === 'legendary'
        ? ['#eab308', '#fbbf24', '#fcd34d']
        : rarity === 'epic'
        ? ['#a855f7', '#c084fc', '#d8b4fe']
        : rarity === 'rare'
        ? ['#3b82f6', '#60a5fa', '#93c5fd']
        : [];

    if (colors.length > 0) {
      confetti({
        particleCount: rarity === 'legendary' ? 150 : 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    }
  }, []);

  // Start the opening sequence
  const startOpening = useCallback(() => {
    setPhase('shaking');

    setTimeout(() => {
      setPhase('opening');
    }, UI_CONFIG.animations.packShake);

    setTimeout(() => {
      setPhase('revealing');
    }, UI_CONFIG.animations.packShake + UI_CONFIG.animations.packOpen);
  }, []);

  // Handle card reveals one by one
  useEffect(() => {
    if (phase !== 'revealing') return;

    const revealNext = () => {
      if (revealedCards.length < stickers.length) {
        const nextIndex = revealedCards.length;
        const sticker = stickers[nextIndex];

        setRevealedCards((prev) => [...prev, nextIndex]);

        // Trigger confetti for special rarities
        if (sticker && ['rare', 'epic', 'legendary'].includes(sticker.rarity)) {
          setTimeout(() => triggerConfetti(sticker.rarity), 300);
        }
      } else {
        setPhase('complete');
        onComplete?.();
      }
    };

    const timer = setTimeout(revealNext, UI_CONFIG.animations.cardRevealDelay);
    return () => clearTimeout(timer);
  }, [phase, revealedCards.length, stickers, triggerConfetti, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative flex w-full max-w-4xl flex-col items-center px-4">
        {/* Pack animation */}
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'shaking' || phase === 'opening') && (
            <motion.div
              key="pack"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: phase === 'shaking' ? [1, 1.05, 0.95, 1.05, 0.95, 1] : 1,
                opacity: phase === 'opening' ? 0 : 1,
                rotate: phase === 'opening' ? 360 : 0,
              }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{
                duration: phase === 'shaking' ? 0.5 : 0.8,
              }}
              className="relative flex flex-col items-center"
            >
              {/* Pack visual */}
              <div
                className={cn(
                  'flex h-64 w-48 flex-col items-center justify-center rounded-2xl border-4',
                  packType === 'gold' &&
                    'border-yellow-500 bg-gradient-to-br from-yellow-500 to-amber-600',
                  packType === 'silver' &&
                    'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-700',
                  packType === 'basic' &&
                    'border-slate-500 bg-gradient-to-br from-slate-600 to-slate-800'
                )}
              >
                <Package className="h-20 w-20 text-white" />
                <span className="mt-4 text-2xl font-bold text-white capitalize">
                  {packType} Pack
                </span>
              </div>

              {/* Glow effect */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn(
                  'absolute inset-0 -z-10 blur-3xl',
                  packType === 'gold' && 'bg-yellow-500/50',
                  packType === 'silver' && 'bg-blue-500/50',
                  packType === 'basic' && 'bg-slate-500/50'
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed cards */}
        {(phase === 'revealing' || phase === 'complete') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {stickers.map((sticker, index) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                size="lg"
                isRevealing={true}
                revealDelay={revealedCards.includes(index) ? 0 : 10}
                showDetails={true}
                className={cn(
                  'transition-all duration-300',
                  !revealedCards.includes(index) && 'invisible'
                )}
              />
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          {phase === 'idle' && (
            <Button
              onClick={startOpening}
              size="lg"
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-5 w-5" />
              Open Pack
            </Button>
          )}

          {phase === 'shaking' && (
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              Preparing...
            </div>
          )}

          {phase === 'opening' && (
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
              Opening...
            </div>
          )}

          {phase === 'revealing' && (
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 animate-pulse" />
              Revealing cards...
            </div>
          )}

          {phase === 'complete' && (
            <>
              <Button onClick={onClose} variant="outline" size="lg">
                Close
              </Button>
              <Button
                onClick={() => {
                  setPhase('idle');
                  setRevealedCards([]);
                }}
                size="lg"
                className="gap-2"
              >
                <Package className="h-5 w-5" />
                Open Another
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
