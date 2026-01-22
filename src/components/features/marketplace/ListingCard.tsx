/**
 * Listing Card Component
 * Displays a single marketplace listing with buy option
 */

import { motion } from 'framer-motion';
import { ShoppingCart, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RarityBadge } from '@/components/ui/rarity-badge';
import type { MarketplaceListing } from '@/stores/marketplaceStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ListingCardProps {
  listing: MarketplaceListing;
  onBuy: (listing: MarketplaceListing) => void;
  isOwner: boolean;
  onCancel?: (listing: MarketplaceListing) => void;
}

const RARITY_GRADIENTS: Record<string, string> = {
  common: 'from-zinc-600/20 to-zinc-800/20',
  rare: 'from-blue-600/20 to-blue-800/20',
  epic: 'from-purple-600/20 to-purple-800/20',
  legendary: 'from-amber-500/20 to-orange-600/20',
};

const RARITY_BORDERS: Record<string, string> = {
  common: 'border-zinc-500/30',
  rare: 'border-blue-500/30',
  epic: 'border-purple-500/30',
  legendary: 'border-amber-500/30',
};

export function ListingCard({ listing, onBuy, isOwner, onCancel }: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${RARITY_GRADIENTS[listing.rarity]} ${RARITY_BORDERS[listing.rarity]} transition-all duration-300`}
    >
      {/* OG Badge */}
      {listing.isOG && (
        <Badge className="absolute top-2 left-2 z-10 bg-amber-500/90 text-white border-0 text-xs">
          OG
        </Badge>
      )}

      {/* Sticker Image */}
      <div className="aspect-square p-4 flex items-center justify-center">
        <img
          src={listing.stickerImageUrl}
          alt={listing.stickerName}
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 space-y-2 bg-card/50 backdrop-blur-sm">
        {/* Name and Rarity */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight line-clamp-1">
            {listing.stickerName}
          </h3>
          <RarityBadge rarity={listing.rarity} size="sm" />
        </div>

        {/* Seller */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span className="truncate">{listing.sellerDisplay}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {formatDistanceToNow(listing.listedAt, { addSuffix: true, locale: ptBR })}
          </span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Preço</span>
            <span className="font-bold text-primary">{listing.price} MATIC</span>
          </div>
          
          {isOwner ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel?.(listing)}
            >
              Cancelar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onBuy(listing)}
              className="gap-1"
            >
              <ShoppingCart className="h-3 w-3" />
              Comprar
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
