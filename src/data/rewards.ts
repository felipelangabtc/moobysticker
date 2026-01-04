/**
 * Rewards and Badges Configuration
 * Defines achievements, badges, and special rewards for album completion
 */

export type RewardType = 'badge' | 'item' | 'bonus';
export type RewardStatus = 'locked' | 'unlocked' | 'claimed';

export interface Reward {
  /** Unique reward ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Reward type */
  type: RewardType;
  /** Requirement to unlock */
  requirement: RewardRequirement;
  /** Benefit description */
  benefit: string;
  /** Icon name (Lucide) */
  icon: string;
  /** Rarity/importance tier */
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export interface RewardRequirement {
  type: 'page_complete' | 'album_complete' | 'category_complete' | 'rarity_collect';
  /** For page_complete: page number. For rarity_collect: rarity type */
  target?: number | string;
  /** For rarity_collect: how many of that rarity needed */
  count?: number;
}

/**
 * Page completion rewards (10 badges, one per page)
 */
export const PAGE_REWARDS: Reward[] = [
  {
    id: 'page-1-complete',
    name: 'Legends Collector',
    description: 'Complete Page 1 - Legends',
    type: 'badge',
    requirement: { type: 'page_complete', target: 1 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Trophy',
    tier: 'bronze',
  },
  {
    id: 'page-2-complete',
    name: 'Rising Star Scout',
    description: 'Complete Page 2 - Rising Stars',
    type: 'badge',
    requirement: { type: 'page_complete', target: 2 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Star',
    tier: 'bronze',
  },
  {
    id: 'page-3-complete',
    name: 'Champion Hunter',
    description: 'Complete Page 3 - Champions',
    type: 'badge',
    requirement: { type: 'page_complete', target: 3 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Medal',
    tier: 'bronze',
  },
  {
    id: 'page-4-complete',
    name: 'Hall of Fame Curator',
    description: 'Complete Page 4 - Hall of Fame',
    type: 'badge',
    requirement: { type: 'page_complete', target: 4 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Crown',
    tier: 'silver',
  },
  {
    id: 'page-5-complete',
    name: 'World Class Expert',
    description: 'Complete Page 5 - World Class',
    type: 'badge',
    requirement: { type: 'page_complete', target: 5 },
    benefit: '+10% chance for Epic in next pack',
    icon: 'Globe',
    tier: 'silver',
  },
  {
    id: 'page-6-complete',
    name: 'Icon Archivist',
    description: 'Complete Page 6 - Icons',
    type: 'badge',
    requirement: { type: 'page_complete', target: 6 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Sparkles',
    tier: 'silver',
  },
  {
    id: 'page-7-complete',
    name: 'Prodigy Discoverer',
    description: 'Complete Page 7 - Prodigies',
    type: 'badge',
    requirement: { type: 'page_complete', target: 7 },
    benefit: '+5% chance for Rare in next pack',
    icon: 'Zap',
    tier: 'silver',
  },
  {
    id: 'page-8-complete',
    name: 'Master Collector',
    description: 'Complete Page 8 - Masters',
    type: 'badge',
    requirement: { type: 'page_complete', target: 8 },
    benefit: '+10% chance for Epic in next pack',
    icon: 'Award',
    tier: 'gold',
  },
  {
    id: 'page-9-complete',
    name: 'Elite Gatherer',
    description: 'Complete Page 9 - Elite',
    type: 'badge',
    requirement: { type: 'page_complete', target: 9 },
    benefit: '+10% chance for Epic in next pack',
    icon: 'Shield',
    tier: 'gold',
  },
  {
    id: 'page-10-complete',
    name: 'Immortal Keeper',
    description: 'Complete Page 10 - Immortals',
    type: 'badge',
    requirement: { type: 'page_complete', target: 10 },
    benefit: '+15% chance for Legendary in next pack',
    icon: 'Flame',
    tier: 'platinum',
  },
];

/**
 * Special achievement rewards
 */
export const SPECIAL_REWARDS: Reward[] = [
  {
    id: 'album-complete',
    name: 'Album Master',
    description: 'Complete the entire Season 1 album (300/300)',
    type: 'badge',
    requirement: { type: 'album_complete' },
    benefit: 'Exclusive Season 1 Trophy NFT + Early access to Season 2',
    icon: 'BookOpen',
    tier: 'diamond',
  },
  {
    id: 'legendary-collector',
    name: 'Legendary Collector',
    description: 'Collect all Legendary stickers',
    type: 'badge',
    requirement: { type: 'rarity_collect', target: 'legendary', count: 2 },
    benefit: 'Golden profile frame + VIP Discord role',
    icon: 'Gem',
    tier: 'diamond',
  },
  {
    id: 'epic-master',
    name: 'Epic Enthusiast',
    description: 'Collect 10 or more Epic stickers',
    type: 'badge',
    requirement: { type: 'rarity_collect', target: 'epic', count: 10 },
    benefit: 'Free Silver Pack',
    icon: 'Diamond',
    tier: 'gold',
  },
  {
    id: 'rare-hoarder',
    name: 'Rare Hoarder',
    description: 'Collect 30 or more Rare stickers',
    type: 'badge',
    requirement: { type: 'rarity_collect', target: 'rare', count: 30 },
    benefit: 'Free Basic Pack',
    icon: 'Layers',
    tier: 'silver',
  },
];

/**
 * All rewards combined
 */
export const ALL_REWARDS: Reward[] = [...PAGE_REWARDS, ...SPECIAL_REWARDS];

/**
 * Tier styling configuration
 */
export const TIER_STYLES: Record<Reward['tier'], { color: string; bg: string; border: string }> = {
  bronze: {
    color: 'text-amber-700',
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/50',
  },
  silver: {
    color: 'text-slate-300',
    bg: 'bg-slate-700/20',
    border: 'border-slate-400/50',
  },
  gold: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500/50',
  },
  platinum: {
    color: 'text-cyan-300',
    bg: 'bg-cyan-900/20',
    border: 'border-cyan-400/50',
  },
  diamond: {
    color: 'text-purple-300',
    bg: 'bg-purple-900/20',
    border: 'border-purple-400/50',
  },
};
