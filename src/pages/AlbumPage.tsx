/**
 * Album Page - View sticker collection
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAlbumStore, useProgress, usePageStickers } from '@/stores/albumStore';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import { ProgressBar } from '@/components/ui/progress-ring';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES_LIST = [
  'Legends',
  'Rising Stars',
  'Champions',
  'Hall of Fame',
  'World Class',
  'Icons',
  'Prodigies',
  'Masters',
  'Elite',
  'Immortals',
];

export default function AlbumPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const progress = useProgress();
  const pageStickers = usePageStickers(currentPage);
  const pageProgress = progress.pages[currentPage - 1];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My Album</h1>
          <p className="text-muted-foreground">
            Season 1 • {progress.totalCollected}/300 collected
          </p>
        </div>
        <ProgressBar
          value={progress.totalCollected}
          max={300}
          showLabel
          className="w-full md:w-48"
        />
      </div>

      {/* Page navigation */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-card/50 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold">
            Page {currentPage}: {CATEGORIES_LIST[currentPage - 1]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {pageProgress?.collected || 0}/30 stickers
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
          disabled={currentPage === 10}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page selector */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => {
          const pg = progress.pages[page - 1];
          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="relative"
            >
              {page}
              {pg?.isComplete && (
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
        {pageStickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            sticker={sticker}
            size="sm"
            showDetails={false}
          />
        ))}
      </motion.div>
    </div>
  );
}
