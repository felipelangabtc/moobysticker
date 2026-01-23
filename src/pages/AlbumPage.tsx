/**
 * Album Page - View sticker collection
 * Page 1: OG's Mooby (50 stickers)
 * Pages 2-11: Season 1 Categories (30 stickers each)
 *   - Mooby Heroes, Pets and Mounts, Cities and Islands, Professions,
 *   - Monsters, Mini Bosses, Bosses, Items and Equipments, Battles, Skills and Stats
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAlbumStore, useProgress, usePageStickers } from '@/stores/albumStore';
import { OG_STICKERS, TOTAL_OG_STICKERS } from '@/data/ogStickers';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import { ProgressBar } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Crown, Sparkles } from 'lucide-react';

// Page 1 = OG, Pages 2-11 = Season 1 categories
const PAGES_LIST = [
  { name: "OG's Mooby", isOG: true, stickerCount: 50 },
  { name: 'Mooby Heroes', isOG: false, stickerCount: 30 },
  { name: 'Pets and Mounts', isOG: false, stickerCount: 30 },
  { name: 'Cities and Islands', isOG: false, stickerCount: 30 },
  { name: 'Professions', isOG: false, stickerCount: 30 },
  { name: 'Monsters', isOG: false, stickerCount: 30 },
  { name: 'Mini Bosses', isOG: false, stickerCount: 30 },
  { name: 'Bosses', isOG: false, stickerCount: 30 },
  { name: 'Items and Equipments', isOG: false, stickerCount: 30 },
  { name: 'Battles', isOG: false, stickerCount: 30 },
  { name: 'Skills and Stats', isOG: false, stickerCount: 30 },
];

const TOTAL_ALL_STICKERS = 350; // 50 OG + 300 Season 1

export default function AlbumPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const balances = useAlbumStore((state) => state.balances);
  const progress = useProgress();
  
  // For pages 2-11, use the original page stickers (adjusted index)
  const seasonPageStickers = usePageStickers(currentPage > 1 ? currentPage - 1 : 1);
  
  // Get OG stickers with balances
  const ogStickersWithBalance = OG_STICKERS.map((sticker) => ({
    ...sticker,
    id: 1000 + sticker.id, // Use offset ID
    page: 0,
    quantity: balances[1000 + sticker.id] || 0,
  }));
  
  // Calculate OG progress
  const ogCollected = ogStickersWithBalance.filter((s) => s.quantity > 0).length;
  
  // Total collected including OG
  const totalCollected = progress.totalCollected + ogCollected;
  
  // Current page info
  const currentPageInfo = PAGES_LIST[currentPage - 1];
  const isOGPage = currentPage === 1;
  
  // Get stickers for current page
  const currentStickers = isOGPage ? ogStickersWithBalance : seasonPageStickers;
  const currentCollected = isOGPage 
    ? ogCollected 
    : (progress.pages[currentPage - 2]?.collected || 0);
  const currentTotal = currentPageInfo.stickerCount;
  const isPageComplete = currentCollected === currentTotal;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Album</h1>
          <p className="text-muted-foreground">
            {totalCollected}/{TOTAL_ALL_STICKERS} collected
          </p>
        </div>
        <ProgressBar
          value={totalCollected}
          max={TOTAL_ALL_STICKERS}
          showLabel
          className="w-full md:w-48"
        />
      </div>

      {/* Page navigation */}
      <div className={`mb-6 flex items-center justify-between rounded-xl p-4 ${
        isOGPage 
          ? 'bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 border border-yellow-500/20' 
          : 'bg-card/50'
      }`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            {isOGPage && <Crown className="h-5 w-5 text-yellow-500" />}
            <h2 className={`text-xl font-bold ${isOGPage ? 'text-gradient-gold' : ''}`}>
              Page {currentPage}: {currentPageInfo.name}
            </h2>
            {isOGPage && (
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">
                <Sparkles className="mr-1 h-3 w-3" />
                Exclusive
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {currentCollected}/{currentTotal} stickers
            {isPageComplete && <span className="ml-2 text-green-500">✓ Complete</span>}
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.min(11, currentPage + 1))}
          disabled={currentPage === 11}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page selector */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {PAGES_LIST.map((page, index) => {
          const pageNum = index + 1;
          const isOG = page.isOG;
          const pageCollected = isOG 
            ? ogCollected 
            : (progress.pages[pageNum - 2]?.collected || 0);
          const pageTotal = page.stickerCount;
          const complete = pageCollected === pageTotal;
          
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={`relative ${isOG && currentPage !== pageNum ? 'border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10' : ''}`}
            >
              {isOG ? (
                <Crown className="mr-1 h-3 w-3" />
              ) : null}
              {pageNum}
              {complete && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Sticker grid */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10"
      >
        {currentStickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            size="sm"
            showDetails={false}
          />
        ))}
      </motion.div>

      {/* OG Legend */}
      {isOGPage && (
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
      )}
    </div>
  );
}
