/**
 * Sticker Card Component
 * Displays a single sticker with rarity effects and animations
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Sticker, Rarity } from '@/data/stickers';
import { RarityBadge } from '@/components/ui/rarity-badge';
import { HelpCircle } from 'lucide-react';

interface StickerCardProps {
  sticker: Sticker & { quantity: number };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
  isRevealing?: boolean;
  revealDelay?: number;
  className?: string;
}

const sizeStyles = {
  sm: 'w-20 h-28',
  md: 'w-28 h-40',
  lg: 'w-36 h-52',
};

const rarityBorderStyles: Record<Rarity, string> = {
  common: 'border-slate-500/50 hover:border-slate-400',
  rare: 'border-blue-500/50 hover:border-blue-400 hover:shadow-glow-blue',
  epic: 'border-purple-500/50 hover:border-purple-400',
  legendary: 'border-yellow-500/50 hover:border-yellow-400 hover:shadow-glow',
};

const rarityGlowStyles: Record<Rarity, string> = {
  common: '',
  rare: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  epic: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  legendary: 'shadow-[0_0_30px_rgba(234,179,8,0.5)] animate-glow-pulse',
};

export function StickerCard({
  sticker,
  size = 'md',
  showDetails = true,
  onClick,
  isRevealing = false,
  revealDelay = 0,
  className,
}: StickerCardProps) {
  const hasSticker = sticker.quantity > 0;

  if (!hasSticker) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted/50 bg-muted/10 transition-all hover:border-muted/70 hover:bg-muted/20',
          sizeStyles[size],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
        <span className="mt-1 text-xs text-muted-foreground/50">#{sticker.id}</span>
      </div>
    );
  }

  const cardContent = (
    <div
      className={cn(
        'card-shine group relative flex flex-col overflow-hidden rounded-xl border-2 bg-gradient-card transition-all duration-300',
        sizeStyles[size],
        rarityBorderStyles[sticker.rarity],
        hasSticker && rarityGlowStyles[sticker.rarity],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Holographic overlay for legendary */}
      {sticker.rarity === 'legendary' && (
        <div className="holographic pointer-events-none absolute inset-0 z-10" />
      )}

      {/* Sticker image */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={sticker.imageUrl}
          alt={sticker.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        {/* Quantity badge */}
        {sticker.quantity > 1 && (
          <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {sticker.quantity}
          </div>
        )}
      </div>

      {/* Details section */}
      {showDetails && (
        <div className="flex flex-col gap-1 bg-card/80 p-2">
          <span className="truncate text-xs font-medium text-foreground">{sticker.name}</span>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">#{sticker.id}</span>
            <RarityBadge rarity={sticker.rarity} size="sm" showLabel={false} />
          </div>
        </div>
      )}
    </div>
  );

  if (isRevealing) {
    return (
      <motion.div
        initial={{ scale: 0, rotateY: 180, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: revealDelay,
        }}
        style={{ perspective: 1000 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}

/**
 * Empty slot placeholder
 */
interface EmptySlotProps {
  slotNumber: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export function EmptySlot({ slotNumber, size = 'md', onClick, className }: EmptySlotProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted/30 bg-muted/5 transition-all hover:border-muted/50 hover:bg-muted/10',
        sizeStyles[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <span className="text-2xl font-bold text-muted-foreground/20">?</span>
      <span className="text-xs text-muted-foreground/30">#{slotNumber}</span>
    </div>
  );
}
