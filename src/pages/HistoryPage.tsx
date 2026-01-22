/**
 * History Page - Pack openings and transaction history
 */

import { motion } from 'framer-motion';
import { History, Package, Sparkles, Clock, ExternalLink } from 'lucide-react';
import { useAlbumStore } from '@/stores/albumStore';
import { STICKERS_BY_ID } from '@/data/stickers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PACK_LABELS: Record<string, { label: string; color: string }> = {
  basic: { label: 'Básico', color: 'bg-zinc-500' },
  silver: { label: 'Prata', color: 'bg-slate-400' },
  gold: { label: 'Ouro', color: 'bg-yellow-500' },
  og: { label: 'OG Pack', color: 'bg-purple-500' },
};

const RARITY_COLORS: Record<string, string> = {
  common: 'text-zinc-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  return `${days}d atrás`;
}

export default function HistoryPage() {
  const recentOpenings = useAlbumStore((state) => state.recentOpenings);
  const clearRecentOpenings = useAlbumStore((state) => state.clearRecentOpenings);

  const totalPacks = recentOpenings.length;
  const totalStickers = recentOpenings.reduce((acc, o) => acc + o.stickers.length, 0);

  // Count rarities across all openings
  const rarityStats = recentOpenings.reduce(
    (acc, opening) => {
      opening.stickers.forEach((id) => {
        const sticker = STICKERS_BY_ID.get(id);
        if (sticker) {
          acc[sticker.rarity] = (acc[sticker.rarity] || 0) + 1;
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <History className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Histórico
          </h1>
        </div>
        <p className="text-muted-foreground">
          Veja todas as suas aberturas de pacotes e transações
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardContent className="p-4 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalPacks}</p>
            <p className="text-xs text-muted-foreground">Pacotes Abertos</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{totalStickers}</p>
            <p className="text-xs text-muted-foreground">Figurinhas Obtidas</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold">{rarityStats.epic || 0}</p>
            <p className="text-xs text-muted-foreground">Épicas</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold">{rarityStats.legendary || 0}</p>
            <p className="text-xs text-muted-foreground">Lendárias</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Aberturas Recentes
            </CardTitle>
            {recentOpenings.length > 0 && (
              <button
                onClick={clearRecentOpenings}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Limpar histórico
              </button>
            )}
          </CardHeader>
          <CardContent>
            {recentOpenings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhum pacote aberto ainda</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Abra pacotes na loja para ver seu histórico aqui
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pacote</TableHead>
                      <TableHead>Figurinhas</TableHead>
                      <TableHead>Raridades</TableHead>
                      <TableHead className="text-right">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOpenings.map((opening) => {
                      const packInfo = PACK_LABELS[opening.packType] || PACK_LABELS.basic;
                      const openingRarities: Record<string, number> = {};
                      
                      opening.stickers.forEach((id) => {
                        const sticker = STICKERS_BY_ID.get(id);
                        if (sticker) {
                          openingRarities[sticker.rarity] = (openingRarities[sticker.rarity] || 0) + 1;
                        }
                      });

                      return (
                        <TableRow key={opening.id}>
                          <TableCell>
                            <Badge className={`${packInfo.color} text-white`}>
                              {packInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{opening.stickers.length}</span>
                            <span className="text-muted-foreground text-xs ml-1">figurinhas</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              {Object.entries(openingRarities).map(([rarity, count]) => (
                                <span
                                  key={rarity}
                                  className={`text-xs ${RARITY_COLORS[rarity] || 'text-muted-foreground'}`}
                                >
                                  {count}x {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(opening.timestamp)}
                              </span>
                              <span className="text-xs text-muted-foreground/60">
                                {formatDate(opening.timestamp)}
                              </span>
                            </div>
                            {opening.txHash && (
                              <a
                                href={`https://polygonscan.com/tx/${opening.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Ver tx
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
