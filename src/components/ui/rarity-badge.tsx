/**
 * Rarity Badge Component
 * Displays rarity tier with appropriate styling
 */

import { cn } from '@/lib/utils';
import type { Rarity } from '@/data/stickers';
import { RARITY_CONFIG } from '@/config/constants';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-5 text-xs px-2',
  md: 'h-6 text-sm px-3',
  lg: 'h-8 text-base px-4',
};

const rarityStyles: Record<Rarity, string> = {
  common: 'bg-slate-600/30 text-slate-300 border-slate-500/50',
  rare: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
  epic: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
  legendary: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50 animate-glow-pulse',
};

export function RarityBadge({
  rarity,
  size = 'md',
  showLabel = true,
  className,
}: RarityBadgeProps) {
  const config = RARITY_CONFIG[rarity];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-medium',
        sizeStyles[size],
        rarityStyles[rarity],
        className
      )}
    >
      {showLabel ? config.name : rarity[0].toUpperCase()}
    </span>
  );
}

/**
 * Rarity dot indicator (for compact displays)
 */
export function RarityDot({ rarity, className }: { rarity: Rarity; className?: string }) {
  const dotStyles: Record<Rarity, string> = {
    common: 'bg-slate-400',
    rare: 'bg-blue-400',
    epic: 'bg-purple-400',
    legendary: 'bg-yellow-400 animate-pulse',
  };

  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full', dotStyles[rarity], className)}
      title={RARITY_CONFIG[rarity].name}
    />
  );
}
