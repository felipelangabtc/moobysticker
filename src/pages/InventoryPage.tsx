/**
 * Inventory Page
 * Displays all collected stickers with filters and sorting
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Filter, SortAsc, Layers, Sparkles, Crown, Star, Gem } from 'lucide-react';
import { useAlbumStore, useDuplicates } from '@/stores/albumStore';
import { STICKERS_BY_ID } from '@/data/stickers';
import { OG_STICKERS_BY_ID } from '@/data/ogStickers';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import { StickerDetailModal } from '@/components/features/sticker/StickerDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Rarity } from '@/data/stickers';

type FilterType = 'all' | 'duplicates' | 'unique' | Rarity;
type SortType = 'id' | 'rarity' | 'quantity' | 'name';

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

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  legendary: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export default function InventoryPage() {
  const navigate = useNavigate();
  const balances = useAlbumStore((state) => state.balances);
  const duplicates = useDuplicates();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('rarity');
  const [showOG, setShowOG] = useState<'all' | 'season1' | 'og'>('all');
  const [selectedSticker, setSelectedSticker] = useState<{
    id: number;
    name: string;
    rarity: Rarity;
    imageUrl: string;
    quantity: number;
    isOG: boolean;
  } | null>(null);

  // Calculate duplicates by rarity
  const duplicatesByRarity = useMemo(() => {
    const counts: Record<Rarity, number> = { common: 0, rare: 0, epic: 0, legendary: 0 };
    duplicates.forEach((item) => {
      counts[item.rarity] += item.quantity - 1;
    });
    return counts;
  }, [duplicates]);

  const handleCraft = (rarity: Rarity) => {
    setSelectedSticker(null);
    navigate('/craft');
  };

  // Build inventory from balances
  const inventory = useMemo(() => {
    const items: Array<{
      id: number;
      name: string;
      rarity: Rarity;
      quantity: number;
      imageUrl: string;
      isOG: boolean;
    }> = [];

    Object.entries(balances).forEach(([idStr, quantity]) => {
      if (quantity <= 0) return;

      const id = parseInt(idStr);

      // Check if it's an OG sticker (IDs 1001-1050)
      if (id >= 1001 && id <= 1050) {
        const ogSticker = OG_STICKERS_BY_ID.get(id - 1000);
        if (ogSticker) {
          items.push({
            id,
            name: ogSticker.name,
            rarity: ogSticker.rarity,
            quantity,
            imageUrl: ogSticker.imageUrl,
            isOG: true,
          });
        }
      } else {
        // Season 1 sticker
        const sticker = STICKERS_BY_ID.get(id);
        if (sticker) {
          items.push({
            id,
            name: sticker.name,
            rarity: sticker.rarity,
            quantity,
            imageUrl: sticker.imageUrl,
            isOG: false,
          });
        }
      }
    });

    return items;
  }, [balances]);

  // Apply filters
  const filteredInventory = useMemo(() => {
    let result = [...inventory];

    // Filter by collection type
    if (showOG === 'og') {
      result = result.filter((item) => item.isOG);
    } else if (showOG === 'season1') {
      result = result.filter((item) => !item.isOG);
    }

    // Apply rarity/duplicate filters
    switch (filter) {
      case 'duplicates':
        result = result.filter((item) => item.quantity > 1);
        break;
      case 'unique':
        result = result.filter((item) => item.quantity === 1);
        break;
      case 'common':
      case 'rare':
      case 'epic':
      case 'legendary':
        result = result.filter((item) => item.rarity === filter);
        break;
    }

    // Apply sorting
    switch (sort) {
      case 'id':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'rarity':
        result.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]);
        break;
      case 'quantity':
        result.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [inventory, filter, sort, showOG]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const unique = inventory.length;
    const duplicates = inventory.reduce((sum, item) => sum + Math.max(0, item.quantity - 1), 0);
    const rarityCounts: Record<Rarity, number> = { common: 0, rare: 0, epic: 0, legendary: 0 };

    inventory.forEach((item) => {
      rarityCounts[item.rarity] += item.quantity;
    });

    return { total, unique, duplicates, rarityCounts };
  }, [inventory]);

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
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Meu Inventário</h1>
          </div>
          <p className="text-muted-foreground">
            Todas as suas figurinhas coletadas em um só lugar
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total de Figurinhas</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{stats.unique}</div>
            <div className="text-sm text-muted-foreground">Únicas</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">{stats.duplicates}</div>
            <div className="text-sm text-muted-foreground">Duplicatas</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold">
              <span className="text-purple-400">{stats.rarityCounts.epic}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-amber-400">{stats.rarityCounts.legendary}</span>
            </div>
            <div className="text-sm text-muted-foreground">Épicas / Lendárias</div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4 space-y-4"
        >
          {/* Collection Type Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs value={showOG} onValueChange={(v) => setShowOG(v as typeof showOG)}>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="season1">Season 1</TabsTrigger>
                <TabsTrigger value="og" className="gap-1">
                  <Crown className="h-3 w-3" />
                  OG
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 flex-wrap">
              {/* Sort Select */}
              <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rarity">Raridade</SelectItem>
                  <SelectItem value="quantity">Quantidade</SelectItem>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rarity Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <Filter className="h-4 w-4 mr-1" />
              Todas
            </Button>
            <Button
              variant={filter === 'duplicates' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('duplicates')}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Duplicatas
            </Button>
            <Button
              variant={filter === 'unique' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unique')}
            >
              Únicas
            </Button>
            <div className="w-px bg-border mx-1" />
            {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((rarity) => (
              <Button
                key={rarity}
                variant={filter === rarity ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(rarity)}
                className="capitalize"
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
            Mostrando <span className="font-medium text-foreground">{filteredInventory.length}</span> figurinhas
          </p>
          {filter !== 'all' && (
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>
              Limpar filtro
            </Button>
          )}
        </div>

        {/* Sticker Grid */}
        {filteredInventory.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
          >
            {filteredInventory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
                className="relative"
              >
                <StickerCard
                  sticker={{
                    id: item.id,
                    name: item.name,
                    rarity: item.rarity,
                    imageUrl: item.imageUrl,
                    quantity: item.quantity,
                    page: 0,
                    slot: 0,
                    category: item.isOG ? 'OG' : 'Legends',
                    season: item.isOG ? 0 : 1,
                  }}
                  size="sm"
                  showDetails={false}
                  onClick={() => setSelectedSticker(item)}
                />
                {/* Quantity Badge */}
                {item.quantity > 1 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground"
                  >
                    x{item.quantity}
                  </Badge>
                )}
                {/* OG Badge */}
                {item.isOG && (
                  <Badge
                    className="absolute -top-1 -left-1 h-5 px-1 text-[10px] bg-amber-500/90 text-white border-0"
                  >
                    OG
                  </Badge>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {inventory.length === 0
                ? 'Seu inventário está vazio'
                : 'Nenhuma figurinha encontrada com esses filtros'}
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {inventory.length === 0
                ? 'Abra pacotes para começar sua coleção!'
                : 'Tente ajustar os filtros para ver mais resultados'}
            </p>
          </motion.div>
        )}

        {/* Rarity Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 pt-4"
        >
          {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((rarity) => (
            <Badge key={rarity} variant="outline" className={RARITY_COLORS[rarity]}>
              {RARITY_ICONS[rarity]}
              <span className="ml-1 capitalize">
                {rarity === 'common' && 'Comum'}
                {rarity === 'rare' && 'Rara'}
                {rarity === 'epic' && 'Épica'}
                {rarity === 'legendary' && 'Lendária'}
              </span>
              <span className="ml-1 opacity-70">({stats.rarityCounts[rarity]})</span>
            </Badge>
          ))}
        </motion.div>

        {/* Sticker Detail Modal */}
        <StickerDetailModal
          sticker={selectedSticker}
          open={!!selectedSticker}
          onOpenChange={(open) => !open && setSelectedSticker(null)}
          duplicatesByRarity={duplicatesByRarity}
          onCraft={handleCraft}
        />
      </div>
    </div>
  );
}
