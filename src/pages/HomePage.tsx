/**
 * Home Page - Hero section and overview
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAlbumStore, useProgress } from '@/stores/albumStore';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/ui/progress-ring';
import { RarityBadge } from '@/components/ui/rarity-badge';
import { DailyLoginRewards } from '@/components/features/daily/DailyLoginRewards';
import { useTranslation } from '@/hooks/useTranslation';
import { RARITY_CONFIG } from '@/config/constants';
import {
  BookOpen,
  Package,
  Flame,
  Trophy,
  Wallet,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const connectedAddress = useAlbumStore((state) => state.connectedAddress);
  const setConnectedAddress = useAlbumStore((state) => state.setConnectedAddress);
  const mockAddStickers = useAlbumStore((state) => state.mockAddStickers);
  const progress = useProgress();
  const t = useTranslation();

  const handleConnect = () => {
    setConnectedAddress('0x1234567890abcdef1234567890abcdef12345678');
    mockAddStickers([1, 2, 3, 5, 10, 15, 22, 28, 45, 67, 89, 120, 150, 180, 200, 250, 299]);
  };

  const features = [
    {
      icon: Package,
      title: t.home.openPacks,
      description: t.packs.basicPackDesc,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: BookOpen,
      title: t.home.completeAlbum,
      description: '300 unique stickers across 10 themed pages to collect',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Flame,
      title: t.craft.title,
      description: t.home.step3Desc,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Trophy,
      title: t.rewards.title,
      description: t.rewards.specialPacks,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ];

  const rarityShowcase = [
    { rarity: 'common' as const, chance: '70%', label: RARITY_CONFIG.common.name },
    { rarity: 'rare' as const, chance: '22%', label: RARITY_CONFIG.rare.name },
    { rarity: 'epic' as const, chance: '7%', label: RARITY_CONFIG.epic.name },
    { rarity: 'legendary' as const, chance: '1%', label: RARITY_CONFIG.legendary.name },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.common.season} 1 Now Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
            >
              {t.home.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              {t.home.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {connectedAddress ? (
                <>
                  <Button asChild size="lg" className="gap-2 text-lg">
                    <Link to="/packs">
                      <Package className="h-5 w-5" />
                      {t.packs.title}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 text-lg">
                    <Link to="/album">
                      <BookOpen className="h-5 w-5" />
                      {t.common.viewAll}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleConnect} size="lg" className="gap-2 text-lg">
                    <Wallet className="h-5 w-5" />
                    {t.common.connectWallet}
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 text-lg">
                    <Link to="/album">
                      {t.home.viewAlbum}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <DailyLoginRewards />
          </div>
        </div>
      </section>

      {connectedAddress && (
        <section className="relative py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-4xl rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur"
            >
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                <div className="flex items-center gap-6">
                  <ProgressRing
                    value={progress.percentage}
                    size={100}
                    label={t.album.progress}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {progress.totalCollected} / 300
                    </h3>
                    <p className="text-muted-foreground">{t.album.collected}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {Object.entries(progress.rarityBreakdown).map(([rarity, count]) => (
                    <div key={rarity} className="text-center">
                      <RarityBadge rarity={rarity as any} size="sm" />
                      <p className="mt-1 text-xl font-bold text-foreground">{count}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button asChild>
                    <Link to="/packs">
                      <Package className="mr-2 h-4 w-4" />
                      {t.packs.openPack}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              {t.home.howItWorks}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.home.ctaSubtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Rarity Tiers
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the odds of finding each rarity
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {rarityShowcase.map((item, index) => (
              <motion.div
                key={item.rarity}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  'relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all hover:scale-105',
                  item.rarity === 'common' && 'border-slate-500/50 bg-slate-600/10',
                  item.rarity === 'rare' && 'border-blue-500/50 bg-blue-600/10',
                  item.rarity === 'epic' && 'border-purple-500/50 bg-purple-600/10',
                  item.rarity === 'legendary' && 'border-yellow-500/50 bg-yellow-600/10'
                )}
              >
                {item.rarity === 'legendary' && (
                  <div className="holographic pointer-events-none absolute inset-0" />
                )}
                <Star className={cn(
                  'mx-auto mb-3 h-10 w-10',
                  item.rarity === 'common' && 'text-slate-400',
                  item.rarity === 'rare' && 'text-blue-400',
                  item.rarity === 'epic' && 'text-purple-400',
                  item.rarity === 'legendary' && 'text-yellow-400'
                )} />
                <h3 className="mb-1 font-semibold text-foreground">{item.label}</h3>
                <p className="text-2xl font-bold text-gradient-gold">{item.chance}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-12 text-center"
          >
            <Zap className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              {t.home.ctaTitle}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {t.home.ctaSubtitle}
            </p>
            {connectedAddress ? (
              <Button asChild size="lg" className="gap-2 text-lg">
                <Link to="/packs">
                  <Package className="h-5 w-5" />
                  {t.packs.title}
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="gap-2 text-lg" onClick={handleConnect}>
                <Wallet className="h-5 w-5" />
                {t.common.connectWallet}
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
