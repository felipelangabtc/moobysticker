/**
 * Sticker Detail Modal
 * Shows detailed sticker info with craft options
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, Crown, Star, Gem, Layers, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RarityBadge } from '@/components/ui/rarity-badge';
import { CRAFT_RECIPES } from '@/data/packs';
import type { Rarity } from '@/data/stickers';

interface StickerDetailModalProps {
  sticker: {
    id: number;
    name: string;
    rarity: Rarity;
    imageUrl: string;
    quantity: number;
    isOG?: boolean;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicatesByRarity?: Record<Rarity, number>;
  onCraft?: (rarity: Rarity) => void;
}

const RARITY_ICONS: Record<Rarity, React.ReactNode> = {
  common: <Layers className="h-4 w-4" />,
  rare: <Star className="h-4 w-4" />,
  epic: <Gem className="h-4 w-4" />,
  legendary: <Crown className="h-4 w-4" />,
};

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'from-zinc-400 to-zinc-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-amber-600',
};

const RARITY_BG: Record<Rarity, string> = {
  common: 'bg-zinc-500/10 border-zinc-500/30',
  rare: 'bg-blue-500/10 border-blue-500/30',
  epic: 'bg-purple-500/10 border-purple-500/30',
  legendary: 'bg-amber-500/10 border-amber-500/30',
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Comum',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Lendária',
};

export function StickerDetailModal({
  sticker,
  open,
  onOpenChange,
  duplicatesByRarity = { common: 0, rare: 0, epic: 0, legendary: 0 },
  onCraft,
}: StickerDetailModalProps) {
  if (!sticker) return null;

  // Find applicable craft recipe for this sticker's rarity
  const craftRecipe = CRAFT_RECIPES.find((r) => r.input.rarity === sticker.rarity);
  const canCraft = craftRecipe && duplicatesByRarity[sticker.rarity] >= craftRecipe.input.count;
  const duplicatesNeeded = craftRecipe ? craftRecipe.input.count : 0;
  const currentDuplicates = duplicatesByRarity[sticker.rarity];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border overflow-hidden p-0">
        {/* Header with gradient background */}
        <div className={`relative h-48 bg-gradient-to-br ${RARITY_COLORS[sticker.rarity]} p-6`}>
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Sticker Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative z-10 flex justify-center"
          >
            <div className="relative">
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className="h-36 w-36 object-contain drop-shadow-2xl"
              />
              {sticker.quantity > 1 && (
                <Badge className="absolute -top-2 -right-2 h-7 min-w-7 flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground">
                  x{sticker.quantity}
                </Badge>
              )}
              {sticker.isOG && (
                <Badge className="absolute -top-2 -left-2 h-6 px-2 text-xs bg-amber-500 text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  OG
                </Badge>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name and Rarity */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">{sticker.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <RarityBadge rarity={sticker.rarity} />
              <span className="text-sm text-muted-foreground">
                ID: #{sticker.id}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className={`rounded-lg border p-4 ${RARITY_BG[sticker.rarity]}`}>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{sticker.quantity}</div>
                <div className="text-xs text-muted-foreground">Em posse</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sticker.quantity > 1 ? sticker.quantity - 1 : 0}
                </div>
                <div className="text-xs text-muted-foreground">Duplicatas</div>
              </div>
            </div>
          </div>

          {/* Craft Section */}
          {craftRecipe && sticker.rarity !== 'legendary' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Flame className="h-4 w-4 text-orange-400" />
                <span>Opção de Craft</span>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {RARITY_ICONS[sticker.rarity]}
                      <span className="text-sm">{craftRecipe.input.count}x {RARITY_LABELS[sticker.rarity]}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-1">
                      {RARITY_ICONS[craftRecipe.output.rarity]}
                      <span className="text-sm">1x {RARITY_LABELS[craftRecipe.output.rarity]}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Duplicatas disponíveis</span>
                    <span>{currentDuplicates}/{duplicatesNeeded}</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${RARITY_COLORS[craftRecipe.output.rarity]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((currentDuplicates / duplicatesNeeded) * 100, 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {onCraft && (
                  <Button
                    onClick={() => onCraft(sticker.rarity)}
                    disabled={!canCraft}
                    className="w-full"
                    variant={canCraft ? 'default' : 'secondary'}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    {canCraft ? 'Forjar Agora' : `Precisa de ${duplicatesNeeded - currentDuplicates} duplicatas`}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Legendary info */}
          {sticker.rarity === 'legendary' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
              <Crown className="h-8 w-8 mx-auto text-amber-400 mb-2" />
              <p className="text-sm text-muted-foreground">
                Figurinhas lendárias são as mais raras e não podem ser usadas em craft.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
