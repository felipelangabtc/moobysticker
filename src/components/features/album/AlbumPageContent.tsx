/**
 * Album Page Content Component
 * Renders the sticker grid for a single album page
 * Uses forwardRef as required by react-pageflip
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { StickerCard } from '@/components/features/sticker/StickerCard';
import type { Sticker } from '@/data/stickers';

interface AlbumPageContentProps {
  pageNumber: number;
  title: string;
  stickers: (Sticker & { quantity: number })[];
  isOG?: boolean;
  side: 'left' | 'right';
  collectedCount: number;
  totalCount: number;
}

const AlbumPageContent = forwardRef<HTMLDivElement, AlbumPageContentProps>(
  ({ pageNumber, title, stickers, isOG = false, side, collectedCount, totalCount }, ref) => {
    // Use 5 columns for all pages
    const gridCols = 'album-sticker-grid--5cols';

    return (
      <div
        ref={ref}
        className={cn(
          'album-page',
          side === 'left' ? 'album-page--left' : 'album-page--right',
          isOG && 'album-page--og'
        )}
      >
        <div className="album-page-content">
          {/* Page header */}
          <div className="album-page-header">
            <h3 className="album-page-title">{title}</h3>
            <p className="album-page-subtitle">
              {collectedCount}/{totalCount} stickers
            </p>
          </div>

          {/* Sticker grid */}
          <div className={cn('album-sticker-grid', gridCols)}>
            {stickers.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                size="sm"
                showDetails={false}
              />
            ))}
          </div>

          {/* Page number */}
          <span
            className={cn(
              'album-page-number',
              side === 'left' ? 'album-page-number--left' : 'album-page-number--right'
            )}
          >
            {pageNumber}
          </span>
        </div>
      </div>
    );
  }
);

AlbumPageContent.displayName = 'AlbumPageContent';

/**
 * Inside Cover Component (title page)
 */
interface InsideCoverProps {
  totalCollected: number;
  totalStickers: number;
}

export const InsideCover = forwardRef<HTMLDivElement, InsideCoverProps>(
  ({ totalCollected, totalStickers }, ref) => {
    return (
      <div ref={ref} className="album-page album-page--left">
        <div className="inside-cover">
          <h2 className="inside-cover-title">Mooby Stickers</h2>
          <p className="inside-cover-subtitle">Collection Album</p>
          <div className="inside-cover-divider" />
          <p className="inside-cover-subtitle">Season 1</p>
          <p className="inside-cover-info">
            {totalCollected} of {totalStickers} stickers collected
          </p>
        </div>
      </div>
    );
  }
);

InsideCover.displayName = 'InsideCover';

export { AlbumPageContent };
