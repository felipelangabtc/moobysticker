/**
 * Pack Card Component
 * Displays a purchasable pack with animations and details
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PackConfig } from '@/data/packs';
import { Button } from '@/components/ui/button';
import { Sparkles, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatOdds } from '@/data/packs';

interface PackCardProps {
  pack: PackConfig;
  onBuy?: () => void;
  onOpen?: () => void;
  ownedCount?: number;
  isLoading?: boolean;
  requiresWallet?: boolean;
  className?: string;
}

export function PackCard({
  pack,
  onBuy,
  onOpen,
  ownedCount = 0,
  isLoading = false,
  requiresWallet = false,
  className,
}: PackCardProps) {
  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    if (requiresWallet) return 'Connect Wallet';
    return 'Buy with POL';
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
          pack.style.gradient,
          pack.style.border,
          'hover:' + pack.style.glow
        )}
      >
        {/* Animated background particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={cn('absolute h-1 w-1 rounded-full bg-white/20')}
              initial={{ x: Math.random() * 100 + '%', y: '100%', opacity: 0 }}
              animate={{
                y: '-10%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Pack icon/visual */}
        <div className="relative mb-4 flex justify-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Pack visual placeholder */}
            <div className="flex h-32 w-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-white/20 to-white/5 shadow-lg backdrop-blur">
              <Sparkles className={cn('h-10 w-10', pack.style.accent)} />
              <span className="mt-2 text-3xl font-bold text-white">{pack.stickerCount}</span>
            </div>

            {/* Glow effect */}
            <div
              className={cn(
                'absolute inset-0 -z-10 blur-xl',
                pack.style.gradient,
                'opacity-50'
              )}
            />
          </motion.div>
        </div>

        {/* Pack name */}
        <h3 className="mb-1 text-center text-xl font-bold text-white">{pack.name}</h3>

        {/* Description */}
        <p className="mb-4 text-center text-sm text-white/70">{pack.description}</p>

        {/* Price */}
        <div className="mb-4 text-center">
          <span className="text-3xl font-bold text-white">{pack.priceDisplay}</span>
        </div>

        {/* Owned indicator */}
        {ownedCount > 0 && (
          <div className="mb-4 rounded-lg bg-black/20 py-2 text-center">
            <span className="text-sm text-white/80">
              Owned: <span className="font-bold text-white">{ownedCount}</span>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {ownedCount > 0 && onOpen && (
            <Button
              onClick={onOpen}
              disabled={isLoading}
              className="flex-1 bg-white/20 text-white hover:bg-white/30"
            >
              Open Pack
            </Button>
          )}
          <Button
            onClick={onBuy}
            disabled={isLoading}
            className="flex-1 bg-white text-black hover:bg-white/90 disabled:opacity-70"
          >
            {getButtonText()}
          </Button>
        </div>

        {/* Blockchain indicator */}
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          Polygon Amoy
        </div>

        {/* Info button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white/60 hover:text-white"
            >
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>{pack.name} Details</DialogTitle>
              <DialogDescription>
                Drop rates and guarantees for this pack type
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Guarantees */}
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Guarantees</h4>
                <ul className="space-y-1">
                  {pack.guarantees.map((g, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {g.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Drop rates */}
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Base Drop Rates</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-600/20 p-2 text-center">
                    <span className="text-xs text-slate-400">Common</span>
                    <p className="font-bold text-slate-300">{formatOdds(pack.odds.common)}</p>
                  </div>
                  <div className="rounded-lg bg-blue-600/20 p-2 text-center">
                    <span className="text-xs text-blue-400">Rare</span>
                    <p className="font-bold text-blue-300">{formatOdds(pack.odds.rare)}</p>
                  </div>
                  <div className="rounded-lg bg-purple-600/20 p-2 text-center">
                    <span className="text-xs text-purple-400">Epic</span>
                    <p className="font-bold text-purple-300">{formatOdds(pack.odds.epic)}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-600/20 p-2 text-center">
                    <span className="text-xs text-yellow-400">Legendary</span>
                    <p className="font-bold text-yellow-300">{formatOdds(pack.odds.legendary)}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
