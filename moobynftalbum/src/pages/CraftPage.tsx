/**
 * Craft Page - Burn stickers to forge higher rarity
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RarityBadge } from '@/components/ui/rarity-badge';
import { CRAFT_RECIPES, type CraftRecipe } from '@/data/packs';
import { RARITY_CONFIG } from '@/config/constants';
import { useDuplicates } from '@/stores/albumStore';
import type { Rarity } from '@/data/stickers';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

const rarityColors: Record<Rarity, string> = {
  common: 'from-slate-500 to-slate-700',
  rare: 'from-blue-500 to-blue-700',
  epic: 'from-purple-500 to-purple-700',
  legendary: 'from-yellow-500 to-amber-600',
};

const rarityBorderColors: Record<Rarity, string> = {
  common: 'border-slate-500/50',
  rare: 'border-blue-500/50',
  epic: 'border-purple-500/50',
  legendary: 'border-yellow-500/50',
};

interface CraftRecipeCardProps {
  recipe: CraftRecipe;
  duplicateCount: number;
  onCraft: () => void;
  isProcessing: boolean;
}

function CraftRecipeCard({ recipe, duplicateCount, onCraft, isProcessing }: CraftRecipeCardProps) {
  const canCraft = duplicateCount >= recipe.input.count;
  const progress = Math.min(duplicateCount, recipe.input.count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 hover:scale-[1.02]',
        'bg-card/50 backdrop-blur-sm',
        rarityBorderColors[recipe.output.rarity],
        canCraft && 'ring-2 ring-primary/50'
      )}>
        {/* Background gradient */}
        <div className={cn(
          'absolute inset-0 opacity-10 bg-gradient-to-br',
          rarityColors[recipe.output.rarity]
        )} />

        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              {recipe.name}
            </CardTitle>
            {canCraft && (
              <Badge variant="default" className="bg-primary/80">
                Ready
              </Badge>
            )}
          </div>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Recipe visualization */}
          <div className="flex items-center justify-center gap-4">
            {/* Input */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'w-16 h-16 rounded-lg border-2 flex items-center justify-center',
                'bg-gradient-to-br',
                rarityColors[recipe.input.rarity],
                rarityBorderColors[recipe.input.rarity]
              )}>
                <span className="text-2xl font-bold text-white">{recipe.input.count}</span>
              </div>
              <RarityBadge rarity={recipe.input.rarity} size="sm" />
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </motion.div>

            {/* Output */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                'w-16 h-16 rounded-lg border-2 flex items-center justify-center',
                'bg-gradient-to-br relative overflow-hidden',
                rarityColors[recipe.output.rarity],
                rarityBorderColors[recipe.output.rarity]
              )}>
                <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/50" />
                <span className="text-2xl font-bold text-white">{recipe.output.count}</span>
              </div>
              <RarityBadge rarity={recipe.output.rarity} size="sm" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duplicates disponíveis</span>
              <span className={cn(
                'font-medium',
                canCraft ? 'text-primary' : 'text-muted-foreground'
              )}>
                {duplicateCount} / {recipe.input.count}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full bg-gradient-to-r', rarityColors[recipe.output.rarity])}
                initial={{ width: 0 }}
                animate={{ width: `${(progress / recipe.input.count) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Craft button */}
          <Button
            onClick={onCraft}
            disabled={!canCraft || isProcessing}
            className={cn(
              'w-full',
              canCraft && 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            )}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Flame className="h-4 w-4 mr-2" />
              </motion.div>
            ) : (
              <Flame className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? 'Forjando...' : 'Forjar'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CraftSuccessModal({ isOpen, recipe, onClose }: { isOpen: boolean; recipe: CraftRecipe | null; onClose: () => void }) {
  if (!isOpen || !recipe) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative"
        >
          <Card className="w-80 bg-gradient-to-br from-card to-card/80 border-2 border-primary/50">
            <CardContent className="p-6 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold">Forja Completa!</h3>
              
              <p className="text-muted-foreground">
                Você forjou com sucesso {recipe.output.count} sticker {RARITY_CONFIG[recipe.output.rarity].name}!
              </p>

              <RarityBadge rarity={recipe.output.rarity} size="lg" />

              <Button onClick={onClose} className="w-full">
                Continuar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CraftPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<CraftRecipe | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [craftedSticker, setCraftedSticker] = useState<number | null>(null);
  const [lastCraftedRecipe, setLastCraftedRecipe] = useState<CraftRecipe | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const t = useTranslation();
  
  const duplicates = useDuplicates();

  // Calculate duplicates per rarity
  const duplicatesByRarity = useMemo(() => {
    const counts: Record<Rarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    duplicates.forEach((item) => {
      // Count extras (quantity - 1, since 1 is in album)
      counts[item.rarity] += item.quantity - 1;
    });

    return counts;
  }, [duplicates]);

  const totalDuplicates = Object.values(duplicatesByRarity).reduce((a, b) => a + b, 0);

  const handleCraft = async (recipe: CraftRecipe) => {
    setIsProcessing(recipe.id);
    
    // Simulate crafting process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(null);
    setLastCraftedRecipe(recipe);
    setShowSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
          Forja de Stickers
        </h1>
        <p className="text-muted-foreground text-lg">
          Queime duplicatas para forjar stickers de raridade superior
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalDuplicates}</p>
                <p className="text-sm text-muted-foreground">Total de Duplicatas</p>
              </div>
              <div className="h-8 w-px bg-border hidden md:block" />
              {(Object.keys(duplicatesByRarity) as Rarity[]).map((rarity) => (
                <div key={rarity} className="flex items-center gap-2">
                  <RarityBadge rarity={rarity} size="sm" />
                  <span className="font-bold">{duplicatesByRarity[rarity]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info alert */}
      {totalDuplicates === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-200">
                Você precisa de duplicatas para forjar. Abra packs para obter stickers extras!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Craft recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CRAFT_RECIPES.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <CraftRecipeCard
              recipe={recipe}
              duplicateCount={duplicatesByRarity[recipe.input.rarity]}
              onCraft={() => handleCraft(recipe)}
              isProcessing={isProcessing === recipe.id}
            />
          </motion.div>
        ))}
      </div>

      {/* How it works section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Card className="bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-medium mb-1">Colete Duplicatas</h4>
                <p className="text-sm text-muted-foreground">
                  Abra packs para obter stickers. Stickers extras se tornam duplicatas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-medium mb-1">Escolha uma Receita</h4>
                <p className="text-sm text-muted-foreground">
                  Selecione qual raridade você quer forjar com suas duplicatas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-medium mb-1">Forje e Colete</h4>
                <p className="text-sm text-muted-foreground">
                  Queime as duplicatas e receba um sticker de raridade superior!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success modal */}
      <CraftSuccessModal
        isOpen={showSuccess}
        recipe={lastCraftedRecipe}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
