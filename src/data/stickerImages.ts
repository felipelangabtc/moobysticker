/**
 * Sticker Images - Mapping of sticker IDs to generated images
 * This provides a sample set of images for testing
 */

// Import generated sticker images - Season 1
import legendaryGoldenWarrior from '@/assets/stickers/legendary-golden-warrior.png';
import legendaryCelestialDragon from '@/assets/stickers/legendary-celestial-dragon.png';
import legendaryRadiantAngel from '@/assets/stickers/legendary-radiant-angel.png';
import legendaryVoidKing from '@/assets/stickers/legendary-void-king.png';
import epicPhoenix from '@/assets/stickers/epic-phoenix.png';
import epicThunderKnight from '@/assets/stickers/epic-thunder-knight.png';
import epicLeviathan from '@/assets/stickers/epic-leviathan.png';
import epicBlazingWyvern from '@/assets/stickers/epic-blazing-wyvern.png';
import epicMysticUnicorn from '@/assets/stickers/epic-mystic-unicorn.png';
import epicPrimalBehemoth from '@/assets/stickers/epic-primal-behemoth.png';
import epicInfernoDemon from '@/assets/stickers/epic-inferno-demon.png';
import epicHolyPaladin from '@/assets/stickers/epic-holy-paladin.png';
import epicWarHydra from '@/assets/stickers/epic-war-hydra.png';
import epicGlacialTitan from '@/assets/stickers/epic-glacial-titan.png';
import epicKrakenLord from '@/assets/stickers/epic-kraken-lord.png';
import epicZephyrPhoenix from '@/assets/stickers/epic-zephyr-phoenix.png';
import epicEclipseKnight from '@/assets/stickers/epic-eclipse-knight.png';
import epicNebulaMage from '@/assets/stickers/epic-nebula-mage.png';
import rareIceDragon from '@/assets/stickers/rare-ice-dragon.png';
import rareCosmicWizard from '@/assets/stickers/rare-cosmic-wizard.png';
import rareShadowNinja from '@/assets/stickers/rare-shadow-ninja.png';
import rareAncientGriffin from '@/assets/stickers/rare-ancient-griffin.png';
import rareJadeSerpent from '@/assets/stickers/rare-jade-serpent.png';
import rareStormElemental from '@/assets/stickers/rare-storm-elemental.png';
import rareLunarWolf from '@/assets/stickers/rare-lunar-wolf.png';
import rareGhostSamurai from '@/assets/stickers/rare-ghost-samurai.png';
import rareFlameDjinn from '@/assets/stickers/rare-flame-djinn.png';
import rareThunderHawk from '@/assets/stickers/rare-thunder-hawk.png';
import rareFierceChimera from '@/assets/stickers/rare-fierce-chimera.png';
import rareLightningBeast from '@/assets/stickers/rare-lightning-beast.png';
import rareVoidWalker from '@/assets/stickers/rare-void-walker.png';
import rareAmberDrake from '@/assets/stickers/rare-amber-drake.png';
import rareDawnRider from '@/assets/stickers/rare-dawn-rider.png';
import rareKarmaSpirit from '@/assets/stickers/rare-karma-spirit.png';
import rareOceanGuardian from '@/assets/stickers/rare-ocean-guardian.png';
import rareTempestArcher from '@/assets/stickers/rare-tempest-archer.png';
import rareYetiBerserker from '@/assets/stickers/rare-yeti-berserker.png';
import commonForestWolf from '@/assets/stickers/common-forest-wolf.png';
import commonFireSalamander from '@/assets/stickers/common-fire-salamander.png';
import commonCrystalGolem from '@/assets/stickers/common-crystal-golem.png';
import commonCursedSpecter from '@/assets/stickers/common-cursed-specter.png';
import commonIronColossus from '@/assets/stickers/common-iron-colossus.png';
import commonNightStalker from '@/assets/stickers/common-night-stalker.png';
import commonSandScorpion from '@/assets/stickers/common-sand-scorpion.png';
import commonVenomSpider from '@/assets/stickers/common-venom-spider.png';
import commonRagingMinotaur from '@/assets/stickers/common-raging-minotaur.png';
import commonPoisonWyrm from '@/assets/stickers/common-poison-wyrm.png';
import commonDarkSentinel from '@/assets/stickers/common-dark-sentinel.png';
import commonEtherealSpirit from '@/assets/stickers/common-ethereal-spirit.png';
import commonOnyxGargoyle from '@/assets/stickers/common-onyx-gargoyle.png';
import commonQuartzGuardian from '@/assets/stickers/common-quartz-guardian.png';
import commonUndyingRevenant from '@/assets/stickers/common-undying-revenant.png';
import commonBronzeGolem from '@/assets/stickers/common-bronze-golem.png';
import commonCrimsonBasilisk from '@/assets/stickers/common-crimson-basilisk.png';
import commonJunglePredator from '@/assets/stickers/common-jungle-predator.png';
import commonMountainGiant from '@/assets/stickers/common-mountain-giant.png';
import commonWindDancer from '@/assets/stickers/common-wind-dancer.png';
import commonHauntedWraith from '@/assets/stickers/common-haunted-wraith.png';

// Import OG sticker images
import ogLegendaryCrown from '@/assets/stickers/og-legendary-crown.png';
import ogDiamondApe from '@/assets/stickers/og-diamond-ape.png';
import ogMoonshot from '@/assets/stickers/og-moonshot.png';
import ogGenesisToken from '@/assets/stickers/og-genesis-token.png';
import ogWhaleKing from '@/assets/stickers/og-whale-king.png';

// Sample sticker data with actual images
export interface StickerImageData {
  id: number;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

// Named stickers for Season 1 - maps ID to { name, image }
export const NAMED_SEASON1_STICKERS: Record<number, { name: string; image: string }> = {
  // Common (slots 1-21 on each page)
  1: { name: 'Forest Wolf', image: commonForestWolf },
  2: { name: 'Ember Salamander', image: commonFireSalamander },
  3: { name: 'Crystal Golem', image: commonCrystalGolem },
  4: { name: 'Cursed Specter', image: commonCursedSpecter },
  5: { name: 'Iron Colossus', image: commonIronColossus },
  6: { name: 'Night Stalker', image: commonNightStalker },
  7: { name: 'Sand Scorpion', image: commonSandScorpion },
  8: { name: 'Venom Spider', image: commonVenomSpider },
  9: { name: 'Raging Minotaur', image: commonRagingMinotaur },
  10: { name: 'Poison Wyrm', image: commonPoisonWyrm },
  11: { name: 'Dark Sentinel', image: commonDarkSentinel },
  12: { name: 'Ethereal Spirit', image: commonEtherealSpirit },
  13: { name: 'Onyx Gargoyle', image: commonOnyxGargoyle },
  14: { name: 'Quartz Guardian', image: commonQuartzGuardian },
  15: { name: 'Undying Revenant', image: commonUndyingRevenant },
  16: { name: 'Bronze Golem', image: commonBronzeGolem },
  17: { name: 'Crimson Basilisk', image: commonCrimsonBasilisk },
  18: { name: 'Jungle Predator', image: commonJunglePredator },
  19: { name: 'Mountain Giant', image: commonMountainGiant },
  20: { name: 'Wind Dancer', image: commonWindDancer },
  21: { name: 'Haunted Wraith', image: commonHauntedWraith },
  
  // Rare (slots 22-27)
  22: { name: 'Frost Dragon', image: rareIceDragon },
  23: { name: 'Ancient Griffin', image: rareAncientGriffin },
  24: { name: 'Jade Serpent', image: rareJadeSerpent },
  25: { name: 'Storm Elemental', image: rareStormElemental },
  26: { name: 'Lunar Wolf', image: rareLunarWolf },
  27: { name: 'Ghost Samurai', image: rareGhostSamurai },
  52: { name: 'Cosmic Wizard', image: rareCosmicWizard },
  53: { name: 'Flame Djinn', image: rareFlameDjinn },
  54: { name: 'Thunder Hawk', image: rareThunderHawk },
  55: { name: 'Fierce Chimera', image: rareFierceChimera },
  56: { name: 'Lightning Beast', image: rareLightningBeast },
  57: { name: 'Void Walker', image: rareVoidWalker },
  82: { name: 'Amber Drake', image: rareAmberDrake },
  83: { name: 'Dawn Rider', image: rareDawnRider },
  84: { name: 'Karma Spirit', image: rareKarmaSpirit },
  85: { name: 'Shadow Ninja', image: rareShadowNinja },
  112: { name: 'Ocean Guardian', image: rareOceanGuardian },
  113: { name: 'Tempest Archer', image: rareTempestArcher },
  114: { name: 'Yeti Berserker', image: rareYetiBerserker },
  
  // Epic (slots 28-29)
  28: { name: 'Arcane Phoenix', image: epicPhoenix },
  29: { name: 'Blazing Wyvern', image: epicBlazingWyvern },
  58: { name: 'Thunder Knight', image: epicThunderKnight },
  59: { name: 'Mystic Unicorn', image: epicMysticUnicorn },
  88: { name: 'Ocean Leviathan', image: epicLeviathan },
  89: { name: 'Primal Behemoth', image: epicPrimalBehemoth },
  118: { name: 'Inferno Demon', image: epicInfernoDemon },
  119: { name: 'Holy Paladin', image: epicHolyPaladin },
  148: { name: 'War Hydra', image: epicWarHydra },
  149: { name: 'Glacial Titan', image: epicGlacialTitan },
  178: { name: 'Kraken Lord', image: epicKrakenLord },
  179: { name: 'Zephyr Phoenix', image: epicZephyrPhoenix },
  208: { name: 'Eclipse Knight', image: epicEclipseKnight },
  209: { name: 'Nebula Mage', image: epicNebulaMage },
  
  // Legendary (slot 30 on pages 5 and 10)
  150: { name: 'Golden Warrior', image: legendaryGoldenWarrior },
  180: { name: 'Radiant Angel', image: legendaryRadiantAngel },
  270: { name: 'Void King', image: legendaryVoidKing },
  300: { name: 'Celestial Dragon', image: legendaryCelestialDragon },
};

// Named stickers for OG Collection - maps ID to { name, image }
export const NAMED_OG_STICKERS: Record<number, { name: string; image: string }> = {
  1: { name: 'Genesis Founder', image: ogGenesisToken },
  7: { name: 'Diamond Hands', image: ogDiamondApe },
  8: { name: 'Moon Walker', image: ogMoonshot },
  11: { name: 'Whale Whisperer', image: ogWhaleKing },
  25: { name: 'Legendary Crown', image: ogLegendaryCrown },
  50: { name: 'Legendary Lord', image: ogLegendaryCrown },
};

// Map for quick lookup - Season 1
export const STICKER_IMAGES_BY_ID = new Map<number, string>(
  Object.entries(NAMED_SEASON1_STICKERS).map(([id, data]) => [parseInt(id), data.image])
);

// Map for quick lookup - OG Collection
export const OG_STICKER_IMAGES_BY_ID = new Map<number, string>(
  Object.entries(NAMED_OG_STICKERS).map(([id, data]) => [parseInt(id), data.image])
);

// Get sticker name by ID
export function getStickerName(id: number, isOG: boolean = false): string | null {
  if (isOG) {
    return NAMED_OG_STICKERS[id]?.name || null;
  }
  return NAMED_SEASON1_STICKERS[id]?.name || null;
}

// Helper to get sticker image by ID (falls back to placeholder)
export function getStickerImage(id: number, isOG: boolean = false): string {
  if (isOG) {
    return OG_STICKER_IMAGES_BY_ID.get(id) || '';
  }
  return STICKER_IMAGES_BY_ID.get(id) || '';
}

// Total generated images count
export const TOTAL_GENERATED_IMAGES = {
  season1: Object.keys(NAMED_SEASON1_STICKERS).length,
  og: Object.keys(NAMED_OG_STICKERS).length,
  total: Object.keys(NAMED_SEASON1_STICKERS).length + Object.keys(NAMED_OG_STICKERS).length,
};
