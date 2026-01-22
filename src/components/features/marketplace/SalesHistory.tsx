/**
 * Sales History Component
 * Displays recent marketplace sales with trends
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  History,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  Layers,
  Star,
  Gem,
  Crown,
} from 'lucide-react';
import { useSalesHistory, useSalesStats, type SaleRecord } from '@/stores/marketplaceStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RarityBadge } from '@/components/ui/rarity-badge';
import type { Rarity } from '@/data/stickers';

const RARITY_ICONS: Record<Rarity, React.ReactNode> = {
  common: <Layers className="h-4 w-4 text-zinc-400" />,
  rare: <Star className="h-4 w-4 text-blue-400" />,
  epic: <Gem className="h-4 w-4 text-purple-400" />,
  legendary: <Crown className="h-4 w-4 text-amber-400" />,
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Comum',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Lendária',
};

interface SalesHistoryProps {
  expanded?: boolean;
}

export function SalesHistory({ expanded = false }: SalesHistoryProps) {
  const salesHistory = useSalesHistory();
  const stats = useSalesStats();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [showAll, setShowAll] = useState(false);

  const displayedSales = useMemo(() => {
    return showAll ? salesHistory : salesHistory.slice(0, 10);
  }, [salesHistory, showAll]);

  // Calculate price trends (compare last 24h average to previous 24h)
  const priceTrends = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const twoDaysAgo = now - 48 * 60 * 60 * 1000;

    const trends: Record<Rarity, 'up' | 'down' | 'stable'> = {
      common: 'stable',
      rare: 'stable',
      epic: 'stable',
      legendary: 'stable',
    };

    const recentPrices: Record<Rarity, number[]> = {
      common: [],
      rare: [],
      epic: [],
      legendary: [],
    };

    const olderPrices: Record<Rarity, number[]> = {
      common: [],
      rare: [],
      epic: [],
      legendary: [],
    };

    salesHistory.forEach((sale) => {
      const price = parseFloat(sale.price);
      if (sale.soldAt >= oneDayAgo) {
        recentPrices[sale.rarity].push(price);
      } else if (sale.soldAt >= twoDaysAgo) {
        olderPrices[sale.rarity].push(price);
      }
    });

    (Object.keys(trends) as Rarity[]).forEach((rarity) => {
      const recentAvg =
        recentPrices[rarity].length > 0
          ? recentPrices[rarity].reduce((a, b) => a + b, 0) / recentPrices[rarity].length
          : 0;
      const olderAvg =
        olderPrices[rarity].length > 0
          ? olderPrices[rarity].reduce((a, b) => a + b, 0) / olderPrices[rarity].length
          : 0;

      if (recentAvg > olderAvg * 1.05) {
        trends[rarity] = 'up';
      } else if (recentAvg < olderAvg * 0.95) {
        trends[rarity] = 'down';
      }
    });

    return trends;
  }, [salesHistory]);

  if (salesHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Histórico de Vendas</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma venda registrada ainda</p>
          <p className="text-sm opacity-70">As transações aparecerão aqui</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Histórico de Vendas</h2>
          <Badge variant="outline" className="ml-2">
            {stats.totalSales} vendas
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 pt-0">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-primary">{stats.sales24h}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Vendas (24h)
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  {stats.volume24h.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Volume 24h (MATIC)</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{stats.salesWeek}</div>
                <div className="text-xs text-muted-foreground">Vendas (7d)</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-amber-400">
                  {stats.volumeWeek.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Volume 7d (MATIC)</div>
              </div>
            </div>

            {/* Price Trends by Rarity */}
            <div className="px-4 pb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Tendência de Preços (24h)
              </div>
              <div className="flex flex-wrap gap-2">
                {(['common', 'rare', 'epic', 'legendary'] as Rarity[]).map((rarity) => (
                  <div
                    key={rarity}
                    className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2"
                  >
                    {RARITY_ICONS[rarity]}
                    <span className="text-sm">{RARITY_LABELS[rarity]}</span>
                    {stats.avgPrices[rarity].count > 0 ? (
                      <>
                        <span className="text-sm font-medium">
                          {stats.avgPrices[rarity].avg.toFixed(2)} MATIC
                        </span>
                        {priceTrends[rarity] === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        )}
                        {priceTrends[rarity] === 'down' && (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Table */}
            <div className="border-t border-border">
              <ScrollArea className="max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Figurinha</TableHead>
                      <TableHead>Raridade</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead className="hidden md:table-cell">Transação</TableHead>
                      <TableHead className="text-right">Quando</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={sale.stickerImageUrl}
                              alt={sale.stickerName}
                              className="w-8 h-8 object-contain rounded"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm truncate max-w-[120px]">
                                {sale.stickerName}
                              </span>
                              {sale.isOG && (
                                <Badge className="w-fit text-[10px] bg-amber-500/80 border-0">
                                  OG
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <RarityBadge rarity={sale.rarity} size="sm" />
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary">{sale.price} MATIC</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="truncate max-w-[60px]">{sale.sellerDisplay}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="truncate max-w-[60px]">{sale.buyerDisplay}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {formatDistanceToNow(sale.soldAt, { addSuffix: true, locale: ptBR })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Show More Button */}
              {salesHistory.length > 10 && (
                <div className="p-3 border-t border-border text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll
                      ? 'Mostrar menos'
                      : `Ver mais ${salesHistory.length - 10} vendas`}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
