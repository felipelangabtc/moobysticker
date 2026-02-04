/**
 * Album Cover Component
 * Front and back covers for the sticker album book
 * Uses forwardRef as required by react-pageflip
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen } from 'lucide-react';

interface AlbumCoverProps {
  type: 'front' | 'back';
}

const AlbumCover = forwardRef<HTMLDivElement, AlbumCoverProps>(({ type }, ref) => {
  if (type === 'front') {
    return (
      <div ref={ref} className="album-cover" data-density="hard">
        <div className="cover-spine" />

        {/* Decorative elements */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <Sparkles className="h-8 w-8 text-yellow-500/60" />
        </div>

        {/* Main title */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl font-bold text-yellow-500/90 tracking-wider mb-2">
            MOOBY
          </h1>
          <h2 className="text-lg font-semibold text-yellow-600/70 tracking-[0.3em] uppercase">
            Sticker Album
          </h2>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto my-4" />

          {/* Season badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5">
            <BookOpen className="h-4 w-4 text-yellow-500/70" />
            <span className="text-sm font-medium text-yellow-500/80">Season 1</span>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-yellow-600/40 tracking-widest uppercase">
            350 Stickers to Collect
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-yellow-500/20 rounded-tl" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-yellow-500/20 rounded-tr" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-yellow-500/20 rounded-bl" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-yellow-500/20 rounded-br" />
      </div>
    );
  }

  // Back cover
  return (
    <div ref={ref} className={cn('album-cover', 'album-cover--back')} data-density="hard">
      <div className="cover-spine" />

      <div className="relative z-10 text-center px-6">
        <Sparkles className="h-6 w-6 text-yellow-500/40 mx-auto mb-4" />

        <p className="text-xs text-yellow-600/40 tracking-widest uppercase mb-2">
          Mooby Stickers
        </p>
        <p className="text-[10px] text-yellow-600/30">
          www.moobysticker.vercel.app
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-yellow-500/15 rounded-tl" />
      <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-yellow-500/15 rounded-tr" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-yellow-500/15 rounded-bl" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-yellow-500/15 rounded-br" />
    </div>
  );
});

AlbumCover.displayName = 'AlbumCover';

export { AlbumCover };
