/**
 * Packs Page - Purchase and view owned packs
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PACK_CONFIGS, PACK_ORDER } from '@/data/packs';
import { PackCard } from '@/components/features/packs/PackCard';
import { PackOpening } from '@/components/features/packs/PackOpening';
import { OGHolderPackCard, OG_PACK_REWARDS } from '@/components/features/packs/OGHolderPackCard';
import { useAlbumStore } from '@/stores/albumStore';
import { toast } from 'sonner';
import { OG_STICKERS } from '@/data/ogStickers';

export default function PacksPage() {
  const [openingPack, setOpeningPack] = useState<{ type: string; stickers: number[] } | null>(null);
  const [pendingPacks, setPendingPacks] = useState<{ gold: number; silver: number; basic: number }>({
    gold: 0,
    silver: 0,
    basic: 0,
  });
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

  const handleClaimOGPack = (tokenId: number) => {
    // Generate 5 random OG sticker IDs (1001-1050)
    const stickers: number[] = [];
    while (stickers.length < OG_PACK_REWARDS.ogStickers) {
      const randomIndex = Math.floor(Math.random() * OG_STICKERS.length);
      const id = OG_STICKERS[randomIndex].id;
      if (!stickers.includes(id)) stickers.push(id);
    }
    
    // Store the bonus packs to be opened after
    setPendingPacks({
      gold: OG_PACK_REWARDS.goldPacks,
      silver: OG_PACK_REWARDS.silverPacks,
      basic: OG_PACK_REWARDS.basicPacks,
    });
    
    setOpeningPack({ type: 'og', stickers });
    toast.success(`OG Holder Pack claimed with Token #${tokenId}!`);
  };

  const handleOpeningComplete = () => {
    if (openingPack) {
      mockAddStickers(openingPack.stickers);
    }
  };

  const handleOpeningClose = () => {
    setOpeningPack(null);
    
    // Check if there are pending packs to open
    const { gold, silver, basic } = pendingPacks;
    const totalPending = gold + silver + basic;
    
    if (totalPending > 0) {
      // Show notification about bonus packs
      toast.info(`You have ${totalPending} bonus packs to open! (${gold} Gold, ${silver} Silver, ${basic} Basic)`, {
        duration: 5000,
      });
    }
  };

  // Calculate total pending packs for display
  const totalPendingPacks = pendingPacks.gold + pendingPacks.silver + pendingPacks.basic;

  // Handle opening a pending pack
  const handleOpenPendingPack = (packType: 'gold' | 'silver' | 'basic') => {
    if (pendingPacks[packType] <= 0) return;
    
    const pack = PACK_CONFIGS[packType];
    const stickers: number[] = [];
    while (stickers.length < pack.stickerCount) {
      const id = Math.floor(Math.random() * 300) + 1;
      if (!stickers.includes(id)) stickers.push(id);
    }
    
    setPendingPacks((prev) => ({
      ...prev,
      [packType]: prev[packType] - 1,
    }));
    
    setOpeningPack({ type: packType, stickers });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold">Pack Shop</h1>
        <p className="text-muted-foreground">Choose your pack and discover new stickers</p>
      </div>

      {/* Pending Bonus Packs Notification */}
      {totalPendingPacks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 max-w-2xl rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4"
        >
          <h3 className="mb-3 text-center font-semibold text-yellow-500">
            🎁 You have {totalPendingPacks} bonus pack(s) to open!
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {pendingPacks.gold > 0 && (
              <button
                onClick={() => handleOpenPendingPack('gold')}
                className="rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Open Gold Pack ({pendingPacks.gold})
              </button>
            )}
            {pendingPacks.silver > 0 && (
              <button
                onClick={() => handleOpenPendingPack('silver')}
                className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Open Silver Pack ({pendingPacks.silver})
              </button>
            )}
            {pendingPacks.basic > 0 && (
              <button
                onClick={() => handleOpenPendingPack('basic')}
                className="rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Open Basic Pack ({pendingPacks.basic})
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* OG Holder Pack - Exclusive Section */}
      <div className="mx-auto mb-8 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OGHolderPackCard onClaim={handleClaimOGPack} />
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
          onClose={handleOpeningClose}
        />
      )}
    </div>
  );
}
