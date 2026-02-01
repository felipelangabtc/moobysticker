/**
 * Create Listing Modal
 * Allows users to list their stickers for sale
 */

import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Tag, Package, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RarityBadge } from '@/components/ui/rarity-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAlbumStore } from '@/stores/albumStore';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { STICKERS_BY_ID } from '@/data/stickers';
import { OG_STICKERS_BY_ID } from '@/data/ogStickers';
import type { Rarity } from '@/data/stickers';
import { useToast } from '@/hooks/use-toast';

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectableSticker {
  id: number;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  quantity: number;
  isOG: boolean;
}

export function CreateListingModal({ open, onOpenChange }: CreateListingModalProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const balances = useAlbumStore((state) => state.balances);
  const updateBalance = useAlbumStore((state) => state.updateBalance);
  const addListing = useMarketplaceStore((state) => state.addListing);

  const [selectedSticker, setSelectedSticker] = useState<SelectableSticker | null>(null);
  const [price, setPrice] = useState('');
  const [step, setStep] = useState<'select' | 'price'>('select');

  // Get available stickers for listing
  const availableStickers = useMemo(() => {
    const stickers: SelectableSticker[] = [];

    Object.entries(balances).forEach(([idStr, quantity]) => {
      if (quantity <= 0) return;

      const id = parseInt(idStr);

      // OG sticker
      if (id >= 1001 && id <= 1050) {
        const ogSticker = OG_STICKERS_BY_ID.get(id - 1000);
        if (ogSticker) {
          stickers.push({
            id,
            name: ogSticker.name,
            rarity: ogSticker.rarity,
            imageUrl: ogSticker.imageUrl,
            quantity,
            isOG: true,
          });
        }
      } else {
        // Season 1 sticker
        const sticker = STICKERS_BY_ID.get(id);
        if (sticker) {
          stickers.push({
            id,
            name: sticker.name,
            rarity: sticker.rarity,
            imageUrl: sticker.imageUrl,
            quantity,
            isOG: false,
          });
        }
      }
    });

    return stickers.sort((a, b) => a.id - b.id);
  }, [balances]);

  const handleSelectSticker = (sticker: SelectableSticker) => {
    setSelectedSticker(sticker);
    setStep('price');
  };

  const handleCreateListing = () => {
    if (!selectedSticker || !price || !address) return;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: 'Preço inválido',
        description: 'Por favor, insira um preço válido maior que 0.',
        variant: 'destructive',
      });
      return;
    }

    // Add listing
    addListing({
      stickerId: selectedSticker.id,
      stickerName: selectedSticker.name,
      stickerImageUrl: selectedSticker.imageUrl,
      rarity: selectedSticker.rarity,
      price: priceNum.toFixed(2),
      seller: address,
      sellerDisplay: `${address.slice(0, 6)}...${address.slice(-4)}`,
      isOG: selectedSticker.isOG,
    });

    // Decrease balance
    updateBalance(selectedSticker.id, selectedSticker.quantity - 1);

    toast({
      title: 'Listagem criada!',
      description: `${selectedSticker.name} listada por ${priceNum.toFixed(2)} MATIC`,
    });

    // Reset and close
    setSelectedSticker(null);
    setPrice('');
    setStep('select');
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('select');
    setSelectedSticker(null);
    setPrice('');
  };

  const handleClose = () => {
    setSelectedSticker(null);
    setPrice('');
    setStep('select');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            {step === 'select' ? 'Selecionar Figurinha' : 'Definir Preço'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select'
              ? 'Escolha uma figurinha do seu inventário para vender'
              : 'Defina o preço de venda em MATIC'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <ScrollArea className="max-h-[400px] pr-4">
            {availableStickers.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableStickers.map((sticker) => (
                  <motion.button
                    key={sticker.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectSticker(sticker)}
                    className="relative rounded-lg border border-border bg-muted/30 p-2 hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={sticker.imageUrl}
                      alt={sticker.name}
                      className="w-full aspect-square object-contain"
                    />
                    <div className="mt-1 text-xs text-center truncate">
                      {sticker.name}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center">
                      x{sticker.quantity}
                    </div>
                    {sticker.isOG && (
                      <div className="absolute -top-1 -left-1 bg-amber-500 text-white text-[10px] font-bold rounded px-1">
                        OG
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Você não possui figurinhas para vender
                </p>
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="space-y-4">
            {/* Selected Sticker Preview */}
            {selectedSticker && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                <img
                  src={selectedSticker.imageUrl}
                  alt={selectedSticker.name}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{selectedSticker.name}</h3>
                  <RarityBadge rarity={selectedSticker.rarity} size="sm" />
                  {selectedSticker.isOG && (
                    <span className="ml-2 text-xs text-amber-500 font-medium">OG</span>
                  )}
                </div>
              </div>
            )}

            {/* Price Input */}
            <div className="space-y-2">
              <Label htmlFor="price">Preço (MATIC)</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  MATIC
                </span>
              </div>
            </div>

            {/* Fee Notice */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-amber-200/80">
                Uma taxa de 2.5% será cobrada na venda. Você receberá{' '}
                {price ? (parseFloat(price) * 0.975).toFixed(4) : '0.00'} MATIC.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Voltar
              </Button>
              <Button
                onClick={handleCreateListing}
                disabled={!price || parseFloat(price) <= 0}
                className="flex-1"
              >
                Criar Listagem
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
