/**
 * Marketplace Page
 * NFT marketplace where users can buy and sell stickers
 */

import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Store, Plus, Filter, Search, Tag, Layers, Star, Gem, Crown, TrendingUp } from 'lucide-react';
import { useMarketplaceStore } from '@/stores/marketplaceStore';
import { useAlbumStore } from '@/stores/albumStore';
import { ListingCard } from '@/components/features/marketplace/ListingCard';
import { CreateListingModal } from '@/components/features/marketplace/CreateListingModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Rarity } from '@/data/stickers';
import type { MarketplaceListing } from '@/stores/marketplaceStore';

type RarityFilter = 'all' | Rarity;
type SortOption = 'recent' | 'price-low' | 'price-high' | 'rarity';
type ViewMode = 'all' | 'my-listings';

const RARITY_ORDER: Record<Rarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

const RARITY_ICONS: Record<Rarity, React.ReactNode> = {
  common: <Layers className="h-4 w-4" />,
  rare: <Star className="h-4 w-4" />,
  epic: <Gem className="h-4 w-4" />,
  legendary: <Crown className="h-4 w-4" />,
};

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const listings = useMarketplaceStore((state) => state.listings);
  const removeListing = useMarketplaceStore((state) => state.removeListing);
  const buyListing = useMarketplaceStore((state) => state.buyListing);
  const updateBalance = useAlbumStore((state) => state.updateBalance);
  const balances = useAlbumStore((state) => state.balances);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Filter by view mode
    if (viewMode === 'my-listings' && address) {
      result = result.filter((l) => l.seller.toLowerCase() === address.toLowerCase());
    }

    // Filter by rarity
    if (rarityFilter !== 'all') {
      result = result.filter((l) => l.rarity === rarityFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.stickerName.toLowerCase().includes(query) ||
          l.seller.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortOption) {
      case 'recent':
        result.sort((a, b) => b.listedAt - a.listedAt);
        break;
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rarity':
        result.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]);
        break;
    }

    return result;
  }, [listings, rarityFilter, sortOption, searchQuery, viewMode, address]);

  // Stats
  const stats = useMemo(() => {
    const total = listings.length;
    const floorPrices: Record<Rarity, number> = {
      common: Infinity,
      rare: Infinity,
      epic: Infinity,
      legendary: Infinity,
    };

    listings.forEach((l) => {
      const price = parseFloat(l.price);
      if (price < floorPrices[l.rarity]) {
        floorPrices[l.rarity] = price;
      }
    });

    return { total, floorPrices };
  }, [listings]);

  const handleBuy = (listing: MarketplaceListing) => {
    if (!isConnected || !address) {
      toast({
        title: 'Conecte sua carteira',
        description: 'Você precisa conectar sua carteira para comprar.',
        variant: 'destructive',
      });
      return;
    }

    if (listing.seller.toLowerCase() === address.toLowerCase()) {
      toast({
        title: 'Ação inválida',
        description: 'Você não pode comprar sua própria listagem.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate buy (in real app, would interact with smart contract)
    const boughtListing = buyListing(listing.id, address);
    if (boughtListing) {
      // Add sticker to buyer's balance
      const currentBalance = balances[boughtListing.stickerId] || 0;
      updateBalance(boughtListing.stickerId, currentBalance + 1);

      toast({
        title: 'Compra realizada!',
        description: `Você comprou ${boughtListing.stickerName} por ${boughtListing.price} MATIC`,
      });
    }
  };

  const handleCancel = (listing: MarketplaceListing) => {
    // Return sticker to seller's balance
    const currentBalance = balances[listing.stickerId] || 0;
    updateBalance(listing.stickerId, currentBalance + 1);

    removeListing(listing.id);

    toast({
      title: 'Listagem cancelada',
      description: `${listing.stickerName} foi removida do marketplace.`,
    });
  };

  const myListingsCount = useMemo(() => {
    if (!address) return 0;
    return listings.filter((l) => l.seller.toLowerCase() === address.toLowerCase()).length;
  }, [listings, address]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Marketplace</h1>
          </div>
          <p className="text-muted-foreground">
            Compre e venda figurinhas com outros colecionadores
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Listagens Ativas</div>
          </div>
          {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((rarity) => (
            <div key={rarity} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                {RARITY_ICONS[rarity]}
                <span className={
                  rarity === 'common' ? 'text-zinc-400' :
                  rarity === 'rare' ? 'text-blue-400' :
                  rarity === 'epic' ? 'text-purple-400' :
                  'text-amber-400'
                }>
                  {stats.floorPrices[rarity] === Infinity ? '-' : `${stats.floorPrices[rarity].toFixed(2)}`}
                </span>
              </div>
              <div className="text-xs text-muted-foreground capitalize">
                Floor {rarity === 'common' ? 'Comum' : rarity === 'rare' ? 'Rara' : rarity === 'epic' ? 'Épica' : 'Lendária'}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4 space-y-4"
        >
          {/* Top Row: View Mode & Create Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="all">
                  Todas Listagens
                </TabsTrigger>
                <TabsTrigger value="my-listings" className="gap-1">
                  <Tag className="h-3 w-3" />
                  Minhas ({myListingsCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {isConnected && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Vender Figurinha
              </Button>
            )}
          </div>

          {/* Bottom Row: Search, Filters, Sort */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou vendedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
              <SelectTrigger className="w-[160px]">
                <TrendingUp className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
                <SelectItem value="rarity">Raridade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rarity Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={rarityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRarityFilter('all')}
            >
              <Filter className="h-4 w-4 mr-1" />
              Todas
            </Button>
            {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((rarity) => (
              <Button
                key={rarity}
                variant={rarityFilter === rarity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRarityFilter(rarity)}
              >
                {RARITY_ICONS[rarity]}
                <span className="ml-1 hidden sm:inline">
                  {rarity === 'common' && 'Comum'}
                  {rarity === 'rare' && 'Rara'}
                  {rarity === 'epic' && 'Épica'}
                  {rarity === 'legendary' && 'Lendária'}
                </span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{filteredListings.length}</span> listagens
          </p>
          {(rarityFilter !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRarityFilter('all');
                setSearchQuery('');
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                <ListingCard
                  listing={listing}
                  onBuy={handleBuy}
                  onCancel={handleCancel}
                  isOwner={address?.toLowerCase() === listing.seller.toLowerCase()}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Store className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {listings.length === 0
                ? 'Nenhuma listagem ativa'
                : 'Nenhuma listagem encontrada com esses filtros'}
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {listings.length === 0
                ? 'Seja o primeiro a listar uma figurinha!'
                : 'Tente ajustar os filtros para ver mais resultados'}
            </p>
            {isConnected && listings.length === 0 && (
              <Button onClick={() => setShowCreateModal(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeira Listagem
              </Button>
            )}
          </motion.div>
        )}

        {/* Not Connected Notice */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center"
          >
            <p className="text-amber-200">
              Conecte sua carteira para comprar ou vender figurinhas no marketplace.
            </p>
          </motion.div>
        )}

        {/* Create Listing Modal */}
        <CreateListingModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      </div>
    </div>
  );
}
