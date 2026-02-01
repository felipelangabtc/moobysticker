/**
 * Rewards Page - View achievements and claim rewards
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Medal, Crown, Globe, Sparkles, Zap, Award, 
  Shield, Flame, BookOpen, Gem, Diamond, Lock, Check, Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBar } from '@/components/ui/progress-ring';
import { PAGE_REWARDS, SPECIAL_REWARDS, type Reward } from '@/data/rewards';
import { useProgress } from '@/stores/albumStore';
import { SEASON_1_STICKERS } from '@/data/stickers';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Star,
  Medal,
  Crown,
  Globe,
  Sparkles,
  Zap,
  Award,
  Shield,
  Flame,
  BookOpen,
  Gem,
  Diamond,
  Gift,
};

const tierColors: Record<string, string> = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-amber-600',
  platinum: 'from-cyan-300 to-blue-500',
  diamond: 'from-purple-400 via-pink-400 to-cyan-400',
};

const tierBorderColors: Record<string, string> = {
  bronze: 'border-amber-700/50',
  silver: 'border-gray-400/50',
  gold: 'border-yellow-500/50',
  platinum: 'border-cyan-400/50',
  diamond: 'border-purple-400/50',
};

const tierBgColors: Record<string, string> = {
  bronze: 'bg-amber-900/20',
  silver: 'bg-gray-500/20',
  gold: 'bg-yellow-500/20',
  platinum: 'bg-cyan-500/20',
  diamond: 'bg-purple-500/20',
};

interface RewardCardProps {
  reward: Reward;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  isClaimed: boolean;
  onClaim: () => void;
}

function RewardCard({ reward, progress, maxProgress, isUnlocked, isClaimed, onClaim }: RewardCardProps) {
  const IconComponent = iconMap[reward.icon] || Trophy;
  const tier = reward.tier || 'bronze';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 h-full',
        'bg-card/50 backdrop-blur-sm',
        tierBorderColors[tier],
        isUnlocked && !isClaimed && 'ring-2 ring-primary/50',
        !isUnlocked && 'opacity-60'
      )}>
        {/* Background gradient for unlocked */}
        {isUnlocked && (
          <div className={cn(
            'absolute inset-0 opacity-10 bg-gradient-to-br',
            tierColors[tier]
          )} />
        )}

        <CardContent className="p-4 relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
              isUnlocked ? `bg-gradient-to-br ${tierColors[tier]}` : 'bg-muted/50'
            )}>
              {isUnlocked ? (
                <IconComponent className="h-6 w-6 text-white" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{reward.name}</h3>
                <Badge variant="outline" className={cn(
                  'text-xs capitalize',
                  tierBgColors[tier],
                  tierBorderColors[tier]
                )}>
                  {tier}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {reward.description}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <ProgressBar 
              value={progress} 
              max={maxProgress} 
              showLabel 
              size="sm"
              color={isUnlocked ? 'success' : 'primary'}
            />
          </div>

          {/* Benefit */}
          <div className={cn(
            'p-2 rounded-lg text-xs mb-3 flex-1',
            tierBgColors[tier]
          )}>
            <p className="flex items-center gap-1">
              <Gift className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-2">{reward.benefit}</span>
            </p>
          </div>

          {/* Action button */}
          {isClaimed ? (
            <Button disabled className="w-full" size="sm">
              <Check className="h-4 w-4 mr-1" />
              Reivindicado
            </Button>
          ) : isUnlocked ? (
            <Button 
              onClick={onClaim} 
              className={cn('w-full bg-gradient-to-r', tierColors[tier])}
              size="sm"
            >
              <Gift className="h-4 w-4 mr-1" />
              Reivindicar
            </Button>
          ) : (
            <Button disabled variant="outline" className="w-full" size="sm">
              <Lock className="h-4 w-4 mr-1" />
              Bloqueado
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatsOverview() {
  const progress = useProgress();

  return (
    <Card className="bg-card/50 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{progress.totalCollected}</p>
            <p className="text-sm text-muted-foreground">Coletados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-400">{progress.rarityBreakdown.common}</p>
            <p className="text-sm text-muted-foreground">Common</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{progress.rarityBreakdown.rare}</p>
            <p className="text-sm text-muted-foreground">Rare</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">{progress.rarityBreakdown.epic}</p>
            <p className="text-sm text-muted-foreground">Epic</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">{progress.rarityBreakdown.legendary}</p>
            <p className="text-sm text-muted-foreground">Legendary</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RewardsPage() {
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());
  const progress = useProgress();

  // Calculate which rewards are unlocked based on collection
  const rewardProgress = useMemo(() => {
    const progressMap: Record<string, { current: number; max: number; unlocked: boolean }> = {};

    // Page rewards
    PAGE_REWARDS.forEach(reward => {
      const pageNum = reward.requirement.target as number;
      const pageProgress = progress.pages[pageNum - 1];
      if (pageProgress) {
        progressMap[reward.id] = {
          current: pageProgress.collected,
          max: pageProgress.total,
          unlocked: pageProgress.isComplete,
        };
      } else {
        progressMap[reward.id] = { current: 0, max: 30, unlocked: false };
      }
    });

    // Special rewards
    SPECIAL_REWARDS.forEach(reward => {
      if (reward.requirement.type === 'album_complete') {
        progressMap[reward.id] = {
          current: progress.totalCollected,
          max: 300,
          unlocked: progress.totalCollected >= 300,
        };
      } else if (reward.requirement.type === 'rarity_collect') {
        const targetRarity = reward.requirement.target as keyof typeof progress.rarityBreakdown;
        const targetCount = reward.requirement.count || 1;
        const collected = progress.rarityBreakdown[targetRarity] || 0;
        progressMap[reward.id] = {
          current: collected,
          max: targetCount,
          unlocked: collected >= targetCount,
        };
      }
    });

    return progressMap;
  }, [progress]);

  const handleClaim = (rewardId: string) => {
    setClaimedRewards(prev => new Set([...prev, rewardId]));
  };

  const unlockedCount = Object.values(rewardProgress).filter(p => p.unlocked).length;
  const totalRewards = PAGE_REWARDS.length + SPECIAL_REWARDS.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
          Recompensas
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete conquistas e desbloqueie recompensas exclusivas
        </p>
      </motion.div>

      {/* Stats overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatsOverview />
      </motion.div>

      {/* Progress summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Progresso Geral</p>
                <p className="text-sm text-muted-foreground">
                  {unlockedCount} de {totalRewards} conquistas desbloqueadas
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {Math.round((unlockedCount / totalRewards) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="w-full mb-6 bg-card/50">
          <TabsTrigger value="pages" className="flex-1">
            <BookOpen className="h-4 w-4 mr-2" />
            Páginas
          </TabsTrigger>
          <TabsTrigger value="special" className="flex-1">
            <Sparkles className="h-4 w-4 mr-2" />
            Especiais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {PAGE_REWARDS.map((reward, index) => {
              const prog = rewardProgress[reward.id] || { current: 0, max: 30, unlocked: false };
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <RewardCard
                    reward={reward}
                    progress={prog.current}
                    maxProgress={prog.max}
                    isUnlocked={prog.unlocked}
                    isClaimed={claimedRewards.has(reward.id)}
                    onClaim={() => handleClaim(reward.id)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="special">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {SPECIAL_REWARDS.map((reward, index) => {
              const prog = rewardProgress[reward.id] || { current: 0, max: 1, unlocked: false };
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <RewardCard
                    reward={reward}
                    progress={prog.current}
                    maxProgress={prog.max}
                    isUnlocked={prog.unlocked}
                    isClaimed={claimedRewards.has(reward.id)}
                    onClaim={() => handleClaim(reward.id)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Info section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Níveis de Conquista
            </CardTitle>
            <CardDescription>
              As recompensas são organizadas por nível de dificuldade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const).map((tier) => (
                <div key={tier} className="text-center">
                  <div className={cn(
                    'w-12 h-12 rounded-full mx-auto mb-2',
                    `bg-gradient-to-br ${tierColors[tier]}`
                  )} />
                  <p className="text-sm font-medium capitalize">{tier}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
