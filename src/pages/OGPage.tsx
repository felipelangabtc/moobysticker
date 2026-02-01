/**
 * OG Page - Exclusive Original sticker collection
 */

import { motion } from 'framer-motion';
import { OG_STICKERS, TOTAL_OG_STICKERS } from '@/data/ogStickers';
import { useAlbumStore } from '@/stores/albumStore';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import { ProgressBar } from '@/components/ui/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function OGPage() {
  const balances = useAlbumStore((state) => state.balances);
  const t = useTranslation();
  
  // Calculate OG progress (OG stickers use negative IDs or separate namespace)
  // For now, using IDs 1000+ for OG stickers to avoid collision
  const ogStickersWithBalance = OG_STICKERS.map((sticker) => ({
    ...sticker,
    quantity: balances[1000 + sticker.id] || 0,
  }));
  
  const collected = ogStickersWithBalance.filter((s) => s.quantity > 0).length;
  const percentage = Math.round((collected / TOTAL_OG_STICKERS) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with special OG styling */}
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/25">
              <Crown className="h-7 w-7 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold text-gradient-gold">
                {t.og.ogStickers}
              </h1>
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
                <Sparkles className="mr-1 h-3 w-3" />
                {t.og.limitedEdition}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {t.og.ogStickersDesc}
            </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold">{collected}/{TOTAL_OG_STICKERS}</p>
              <p className="text-sm text-muted-foreground">collected</p>
            </div>
            <ProgressBar
              value={collected}
              max={TOTAL_OG_STICKERS}
              showLabel
              className="w-32"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 p-4 border border-yellow-500/20">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Pre-Season Collection</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">
            Better odds: 50% Common • 30% Rare • 15% Epic • 5% Legendary
          </span>
        </div>
      </div>

      {/* Sticker grid - 10 columns for 50 stickers (5 rows) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10"
      >
        {ogStickersWithBalance.map((sticker, index) => (
          <motion.div
            key={sticker.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
          >
            <StickerCard
              sticker={{
                ...sticker,
                id: 1000 + sticker.id, // Use offset ID for balance lookup
                page: 0,
              }}
              size="sm"
              showDetails={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-500" />
          <span>Common</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Rare</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-500" />
          <span>Epic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <span>Legendary</span>
        </div>
      </div>
    </div>
  );
}
