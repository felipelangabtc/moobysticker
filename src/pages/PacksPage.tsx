/**
 * Packs Page - Purchase and view owned packs
 * Now with real blockchain integration on Polygon Amoy testnet
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { PACK_CONFIGS, PACK_ORDER, PackType } from '@/data/packs';
import { PackCard } from '@/components/features/packs/PackCard';
import { PackOpening } from '@/components/features/packs/PackOpening';
import { OGHolderPackCard, OG_PACK_REWARDS } from '@/components/features/packs/OGHolderPackCard';
import { useAlbumStore } from '@/stores/albumStore';
import { toast } from 'sonner';
import { OG_STICKERS } from '@/data/ogStickers';
import { usePackPurchase } from '@/hooks/usePackPurchase';
import { useTranslation } from '@/hooks/useTranslation';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PacksPage() {
  const { isConnected, address, chain } = useAccount();
  const { purchasePack, isProcessing, status, reset } = usePackPurchase();
  const t = useTranslation();
  
  const [openingPack, setOpeningPack] = useState<{ type: string; stickers: number[] } | null>(null);
  const [pendingPacks, setPendingPacks] = useState<{ gold: number; silver: number; basic: number }>({
    gold: 0,
    silver: 0,
    basic: 0,
  });
  const [buyingPackType, setBuyingPackType] = useState<string | null>(null);
  const mockAddStickers = useAlbumStore((state) => state.mockAddStickers);

  const handleBuyPack = async (packType: string) => {
    if (!isConnected) {
      toast.error(t.errors.walletNotConnected);
      return;
    }

    setBuyingPackType(packType);
    
    // Execute blockchain transaction
    const success = await purchasePack(packType as PackType);
    
    if (success) {
      const pack = PACK_CONFIGS[packType as keyof typeof PACK_CONFIGS];
      // Generate random sticker IDs after successful purchase
      const stickers: number[] = [];
      while (stickers.length < pack.stickerCount) {
        const id = Math.floor(Math.random() * 300) + 1;
        if (!stickers.includes(id)) stickers.push(id);
      }
      setOpeningPack({ type: packType, stickers });
    }
    
    setBuyingPackType(null);
    reset();
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
    toast.success(t.og.claimSuccess);
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
        
        {/* Network indicator */}
        {isConnected && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
            {chain?.name || 'Unknown Network'}
          </div>
        )}
      </div>

      {/* Wallet connection prompt */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-8 max-w-md rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-6 text-center"
        >
          <Wallet className="mx-auto mb-3 h-12 w-12 text-yellow-500" />
          <h3 className="mb-2 text-lg font-semibold text-yellow-500">Connect Your Wallet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Connect your wallet to purchase packs with POL on Polygon Amoy testnet
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button
                onClick={openConnectModal}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700"
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
          
          {/* Faucet link */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <a 
              href="https://faucet.polygon.technology/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <AlertCircle className="h-3 w-3" />
              Need testnet POL? Get it from the Polygon Faucet
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      )}

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
            <PackCard 
              pack={PACK_CONFIGS[type]} 
              onBuy={() => handleBuyPack(type)}
              isLoading={buyingPackType === type && isProcessing}
              requiresWallet={!isConnected}
            />
          </motion.div>
        ))}
      </div>

      {/* Testnet info */}
      {isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-8 max-w-xl text-center"
        >
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              🧪 <strong>Testnet Mode:</strong> Using Polygon Amoy testnet. 
              Transactions require testnet POL.
            </p>
            <a 
              href="https://faucet.polygon.technology/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Get free testnet POL from the faucet
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      )}

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
