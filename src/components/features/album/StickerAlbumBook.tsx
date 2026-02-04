/**
 * Sticker Album Book Component
 * Main container using react-pageflip for realistic page turning
 */

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-ring';
import { AlbumCover } from './AlbumCover';
import { AlbumPageContent, InsideCover } from './AlbumPageContent';
import { useAlbumStore, useProgress } from '@/stores/albumStore';
import { OG_STICKERS } from '@/data/ogStickers';
import { STICKERS_BY_ID, STICKERS_PER_PAGE } from '@/data/stickers';
import './albumStyles.css';

// Page configuration
const PAGES_CONFIG = [
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

const TOTAL_STICKERS = 350;

interface BookDimensions {
  width: number;
  height: number;
}

function useBookDimensions(): BookDimensions {
  const [dimensions, setDimensions] = useState<BookDimensions>({
    width: 350,
    height: 500,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (isMobile) {
        setDimensions({ width: 280, height: 400 });
      } else if (isTablet) {
        setDimensions({ width: 320, height: 460 });
      } else {
        setDimensions({ width: 380, height: 540 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}

export function StickerAlbumBook() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const dimensions = useBookDimensions();

  const balances = useAlbumStore((state) => state.balances);
  const progress = useProgress();

  // Get all page stickers with useMemo
  const allPageStickers = useMemo(() => {
    const pages: { stickers: any[]; collected: number }[] = [];

    // OG Page (index 0)
    const ogStickersWithBalance = OG_STICKERS.map((sticker) => ({
      ...sticker,
      id: 1000 + sticker.id,
      page: 0,
      quantity: balances[1000 + sticker.id] || 0,
    }));
    const ogCollected = ogStickersWithBalance.filter((s) => s.quantity > 0).length;
    pages.push({ stickers: ogStickersWithBalance, collected: ogCollected });

    // Season 1 pages (1-10)
    for (let page = 1; page <= 10; page++) {
      const stickers: any[] = [];
      for (let slot = 1; slot <= STICKERS_PER_PAGE; slot++) {
        const id = (page - 1) * STICKERS_PER_PAGE + slot;
        const stickerData = STICKERS_BY_ID.get(id);
        if (stickerData) {
          stickers.push({
            ...stickerData,
            quantity: balances[id] || 0,
          });
        }
      }
      const collected = stickers.filter((s) => s.quantity > 0).length;
      pages.push({ stickers, collected });
    }

    return pages;
  }, [balances]);

  // Use real data from store
  const getPageData = useCallback(
    (pageIndex: number) => {
      if (pageIndex < 0 || pageIndex >= allPageStickers.length) {
        return { stickers: [], collected: 0 };
      }
      return allPageStickers[pageIndex];
    },
    [allPageStickers]
  );

  // Calculate total collected including OG
  const ogCollected = allPageStickers[0]?.collected || 0;
  const totalCollected = progress.totalCollected + ogCollected;

  const handlePageFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        flipNext();
      } else if (e.key === 'ArrowLeft') {
        flipPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev]);

  // Calculate total pages in book (cover + inside cover + 11 album pages + back cover)
  const totalBookPages = 14;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Progress header */}
      <div className="album-progress-header">
        <span className="text-sm font-medium text-white/80">Collection Progress</span>
        <ProgressBar value={totalCollected} max={TOTAL_STICKERS} showLabel className="w-32" />
        <span className="text-sm font-bold text-primary">
          {totalCollected}/{TOTAL_STICKERS}
        </span>
      </div>

      {/* Book container */}
      <div className="album-book-container">
        {/* @ts-ignore - react-pageflip types issue */}
        <HTMLFlipBook
          ref={bookRef}
          width={dimensions.width}
          height={dimensions.height}
          size="stretch"
          minWidth={250}
          maxWidth={450}
          minHeight={350}
          maxHeight={650}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startPage={0}
          showCover={true}
          mobileScrollSupport={true}
          swipeDistance={30}
          clickEventForward={false}
          useMouseEvents={true}
          onFlip={handlePageFlip}
          className="shadow-2xl"
          style={{}}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Front Cover */}
          <AlbumCover type="front" />

          {/* Inside Cover (Title Page) */}
          <InsideCover totalCollected={totalCollected} totalStickers={TOTAL_STICKERS} />

          {/* OG Page */}
          <AlbumPageContent
            pageNumber={1}
            title={PAGES_CONFIG[0].name}
            stickers={getPageData(0).stickers}
            isOG={true}
            side="right"
            collectedCount={getPageData(0).collected}
            totalCount={PAGES_CONFIG[0].stickerCount}
          />

          {/* Season 1 Pages (1-10) */}
          {PAGES_CONFIG.slice(1).map((pageConfig, index) => {
            const pageIndex = index + 1;
            const pageData = getPageData(pageIndex);
            const side = pageIndex % 2 === 0 ? 'left' : 'right';

            return (
              <AlbumPageContent
                key={pageIndex}
                pageNumber={pageIndex + 1}
                title={pageConfig.name}
                stickers={pageData.stickers}
                isOG={false}
                side={side as 'left' | 'right'}
                collectedCount={pageData.collected}
                totalCount={pageConfig.stickerCount}
              />
            );
          })}

          {/* Back Cover */}
          <AlbumCover type="back" />
        </HTMLFlipBook>
      </div>

      {/* Navigation */}
      <div className="album-navigation">
        <Button
          variant="ghost"
          size="icon"
          onClick={flipPrev}
          disabled={currentPage === 0}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <span className="album-navigation-info">
          {currentPage === 0
            ? 'Cover'
            : currentPage >= totalBookPages - 1
            ? 'Back Cover'
            : `Page ${currentPage}`}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={flipNext}
          disabled={currentPage >= totalBookPages - 1}
          className="text-white hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground text-center">
        Use arrow keys or swipe to turn pages
      </p>
    </div>
  );
}
