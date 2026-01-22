/**
 * Packs Page - Purchase and view owned packs
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PACK_CONFIGS, PACK_ORDER } from '@/data/packs';
import { PackCard } from '@/components/features/packs/PackCard';
import { PackOpening } from '@/components/features/packs/PackOpening';
import { OGHolderPackCard } from '@/components/features/packs/OGHolderPackCard';
import { useAlbumStore } from '@/stores/albumStore';
import { toast } from 'sonner';
import { OG_STICKERS } from '@/data/ogStickers';

export default function PacksPage() {
  const [openingPack, setOpeningPack] = useState<{ type: string; stickers: number[] } | null>(null);
  const [hasClaimedOG, setHasClaimedOG] = useState(false);
  const mockAddStickers = useAlbumStore((state) => state.mockAddStickers);

  const handleBuyPack = (packType: string) => {
    const pack = PACK_CONFIGS[packType as keyof typeof PACK_CONFIGS];
    // Mock: Generate random sticker IDs
    const stickers: number[] = [];
    while (stickers.length < pack.stickerCount) {
      const id = Math.floor(Math.random() * 300) + 1;
      if (!stickers.includes(id)) stickers.push(id);
    }
    setOpeningPack({ type: packType, stickers });
    toast.success(`${pack.name} purchased!`);
  };

  const handleClaimOGPack = () => {
    // Generate 5 random OG sticker IDs (1001-1050)
    const stickers: number[] = [];
    while (stickers.length < 5) {
      const randomIndex = Math.floor(Math.random() * OG_STICKERS.length);
      const id = OG_STICKERS[randomIndex].id;
      if (!stickers.includes(id)) stickers.push(id);
    }
    setOpeningPack({ type: 'og', stickers });
    setHasClaimedOG(true);
    toast.success('OG Holder Pack claimed!');
  };

  const handleOpeningComplete = () => {
    if (openingPack) {
      mockAddStickers(openingPack.stickers);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Pack Shop</h1>
        <p className="text-muted-foreground">Choose your pack and discover new stickers</p>
      </div>

      {/* OG Holder Pack - Exclusive Section */}
      <div className="mx-auto mb-8 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OGHolderPackCard
            onClaim={handleClaimOGPack}
            hasClaimed={hasClaimedOG}
          />
        </motion.div>
      </div>

      {/* Regular Packs */}
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {PACK_ORDER.map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <PackCard pack={PACK_CONFIGS[type]} onBuy={() => handleBuyPack(type)} />
          </motion.div>
        ))}
      </div>

      {openingPack && (
        <PackOpening
          packType={openingPack.type as any}
          stickerIds={openingPack.stickers}
          onComplete={handleOpeningComplete}
          onClose={() => setOpeningPack(null)}
        />
      )}
    </div>
  );
}
