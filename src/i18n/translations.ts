export type Language = 'en' | 'pt';

export interface Translations {
  common: {
    home: string;
    album: string;
    packs: string;
    inventory: string;
    marketplace: string;
    craft: string;
    rewards: string;
    history: string;
    og: string;
    connectWallet: string;
    wrongNetwork: string;
    connected: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    viewAll: string;
    viewDetails: string;
    search: string;
    filter: string;
    sort: string;
    clear: string;
    copy: string;
    copied: string;
    share: string;
    download: string;
    refresh: string;
    tryAgain: string;
    noResults: string;
    comingSoon: string;
    poweredBy: string;
    season: string;
  };
  home: {
    title: string;
    subtitle: string;
    collectStickers: string;
    completeAlbum: string;
    startCollecting: string;
    viewAlbum: string;
    dailyRewards: string;
    openPacks: string;
    featuredPacks: string;
    latestOpenings: string;
    communityHighlights: string;
    totalCollectors: string;
    stickersCollected: string;
    albumsCompleted: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    howItWorks: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    statsTitle: string;
  };
  album: {
    title: string;
    pageOf: string;
    totalStickers: string;
    collected: string;
    missing: string;
    progress: string;
    rarity: string;
    filterAll: string;
    filterCollected: string;
    filterMissing: string;
    sortBy: string;
    sortNumber: string;
    sortRarity: string;
    pageProgress: string;
    albumComplete: string;
    albumCompleteDesc: string;
    stickerDetails: string;
    quantity: string;
    duplicate: string;
    duplicates: string;
    craftValue: string;
    viewInMarketplace: string;
  };
  packs: {
    title: string;
    subtitle: string;
    basicPack: string;
    basicPackDesc: string;
    silverPack: string;
    silverPackDesc: string;
    goldPack: string;
    goldPackDesc: string;
    openPack: string;
    buyingFrom: string;
    price: string;
    perPack: string;
    available: string;
    sold: string;
    limitedEdition: string;
    new: string;
    popular: string;
    purchasePack: string;
    packOpened: string;
    stickersReceived: string;
    viewingPack: string;
    ogPack: string;
    ogPackDesc: string;
    ogPackTitle: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    totalStickers: string;
    totalDuplicates: string;
    stickers: string;
    duplicates: string;
    filterByRarity: string;
    filterByPage: string;
    allRarities: string;
    allPages: string;
    searchSticker: string;
    noStickers: string;
    noStickersDesc: string;
    duplicateCount: string;
    crafting: string;
    useForCrafting: string;
    selected: string;
    convertToCredits: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    listings: string;
    createListing: string;
    buyNow: string;
    makeOffer: string;
    price: string;
    quantity: string;
    seller: string;
    listed: string;
    expires: string;
    noListings: string;
    noListingsDesc: string;
    filterByRarity: string;
    filterByPrice: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
    newest: string;
    oldest: string;
    lowestPrice: string;
    highestPrice: string;
    listingCreated: string;
    listingCancelled: string;
    itemSold: string;
    yourListings: string;
    activeListings: string;
    soldListings: string;
    totalEarnings: string;
    averagePrice: string;
  };
  craft: {
    title: string;
    subtitle: string;
    selectDuplicates: string;
    craftSticker: string;
    craftingCost: string;
    creditsNeeded: string;
    availableCredits: string;
    craftButton: string;
    craftingInProgress: string;
    craftSuccess: string;
    craftError: string;
    noDuplicates: string;
    noDuplicatesDesc: string;
    rarityGuide: string;
    commonCraft: string;
    rareCraft: string;
    epicCraft: string;
    legendaryCraft: string;
    creditValue: string;
    selectAtLeast: string;
    randomSticker: string;
    guaranteedLegendary: string;
  };
  rewards: {
    title: string;
    subtitle: string;
    dailyLogin: string;
    dailyLoginDesc: string;
    claimReward: string;
    claimed: string;
    nextReward: string;
    streakBonus: string;
    badges: string;
    badgeEarned: string;
    badgeDesc: string;
    claimBadge: string;
    claimedBadges: string;
    availableBadges: string;
    requirements: string;
    bonusCredits: string;
    specialPacks: string;
    exclusiveAccess: string;
    loginStreak: string;
    days: string;
    week: string;
    month: string;
  };
  history: {
    title: string;
    subtitle: string;
    packOpenings: string;
    purchases: string;
    sales: string;
    crafts: string;
    claims: string;
    noHistory: string;
    noHistoryDesc: string;
    date: string;
    type: string;
    details: string;
    txHash: string;
    status: string;
    completed: string;
    pending: string;
    failed: string;
    viewTransaction: string;
  };
  og: {
    title: string;
    subtitle: string;
    ogStickers: string;
    ogStickersDesc: string;
    limitedEdition: string;
    totalSupply: string;
    claimOgPack: string;
    claimOgPackDesc: string;
    ogHolders: string;
    verifyOwnership: string;
    alreadyClaimed: string;
    claimSuccess: string;
    claimError: string;
    connectToClaim: string;
  };
  footer: {
    copyright: string;
    poweredBy: string;
    privacyPolicy: string;
    termsOfService: string;
    contact: string;
    discord: string;
    twitter: string;
    telegram: string;
  };
  errors: {
    walletNotConnected: string;
    walletConnectionFailed: string;
    transactionFailed: string;
    insufficientBalance: string;
    networkError: string;
    unknownError: string;
    loadingError: string;
    notFound: string;
    pageNotFound: string;
    goHome: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      home: 'Home',
      album: 'Album',
      packs: 'Packs',
      inventory: 'Inventory',
      marketplace: 'Marketplace',
      craft: 'Craft',
      rewards: 'Rewards',
      history: 'History',
      og: 'OG',
      connectWallet: 'Connect Wallet',
      wrongNetwork: 'Wrong Network',
      connected: 'Connected',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      viewAll: 'View All',
      viewDetails: 'View Details',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      clear: 'Clear',
      copy: 'Copy',
      copied: 'Copied!',
      share: 'Share',
      download: 'Download',
      refresh: 'Refresh',
      tryAgain: 'Try Again',
      noResults: 'No results found',
      comingSoon: 'Coming Soon',
      poweredBy: 'Powered by',
      season: 'Season',
    },
    home: {
      title: 'Mooby Stickers',
      subtitle: 'Collect, Trade, and Complete Your NFT Sticker Album',
      collectStickers: 'Collect Limited Edition Stickers',
      completeAlbum: 'Complete Your Album',
      startCollecting: 'Start Collecting',
      viewAlbum: 'View Album',
      dailyRewards: 'Daily Rewards',
      openPacks: 'Open Packs',
      featuredPacks: 'Featured Packs',
      latestOpenings: 'Latest Pack Openings',
      communityHighlights: 'Community Highlights',
      totalCollectors: 'Total Collectors',
      stickersCollected: 'Stickers Collected',
      albumsCompleted: 'Albums Completed',
      ctaTitle: 'Ready to Start Your Collection?',
      ctaSubtitle: 'Join thousands of collectors building their digital sticker albums',
      ctaButton: 'Get Started Now',
      howItWorks: 'How It Works',
      step1Title: 'Connect Your Wallet',
      step1Desc: 'Link your Polygon wallet to get started collecting stickers',
      step2Title: 'Open Packs',
      step2Desc: 'Purchase and open packs to discover rare and legendary stickers',
      step3Title: 'Complete Your Album',
      step3Desc: 'Trade duplicates and complete all 300 stickers to unlock rewards',
      statsTitle: 'Community Stats',
    },
    album: {
      title: 'Sticker Album',
      pageOf: 'Page {current} of {total}',
      totalStickers: 'Total Stickers',
      collected: 'Collected',
      missing: 'Missing',
      progress: 'Progress',
      rarity: 'Rarity',
      filterAll: 'All',
      filterCollected: 'Collected',
      filterMissing: 'Missing',
      sortBy: 'Sort by',
      sortNumber: 'Number',
      sortRarity: 'Rarity',
      pageProgress: 'Page Progress',
      albumComplete: 'Album Complete!',
      albumCompleteDesc: 'Congratulations! You\'ve collected all 300 stickers!',
      stickerDetails: 'Sticker Details',
      quantity: 'Quantity',
      duplicate: 'Duplicate',
      duplicates: 'Duplicates',
      craftValue: 'Craft Value',
      viewInMarketplace: 'View in Marketplace',
    },
    packs: {
      title: 'Sticker Packs',
      subtitle: 'Purchase packs to collect new stickers',
      basicPack: 'Basic Pack',
      basicPackDesc: 'Contains 5 random stickers with high chance of commons',
      silverPack: 'Silver Pack',
      silverPackDesc: 'Contains 5 random stickers with better rare chances',
      goldPack: 'Gold Pack',
      goldPackDesc: 'Contains 5 random stickers with increased epic and legendary chances',
      openPack: 'Open Pack',
      buyingFrom: 'Buying from',
      price: 'Price',
      perPack: 'per pack',
      available: 'Available',
      sold: 'Sold',
      limitedEdition: 'Limited Edition',
      new: 'New',
      popular: 'Popular',
      purchasePack: 'Purchase Pack',
      packOpened: 'Pack Opened!',
      stickersReceived: 'You received {count} stickers',
      viewingPack: 'Viewing Pack',
      ogPack: 'OG Pack',
      ogPackDesc: 'Exclusive pack for OG sticker holders',
      ogPackTitle: 'OG Holder Pack',
    },
    inventory: {
      title: 'Inventory',
      subtitle: 'Manage your sticker collection',
      totalStickers: 'Total Stickers',
      totalDuplicates: 'Total Duplicates',
      stickers: 'Stickers',
      duplicates: 'Duplicates',
      filterByRarity: 'Filter by Rarity',
      filterByPage: 'Filter by Page',
      allRarities: 'All Rarities',
      allPages: 'All Pages',
      searchSticker: 'Search sticker...',
      noStickers: 'No stickers in inventory',
      noStickersDesc: 'Start collecting by opening some packs!',
      duplicateCount: '{count} duplicates',
      crafting: 'Crafting',
      useForCrafting: 'Use for Crafting',
      selected: 'Selected',
      convertToCredits: 'Convert to Credits',
    },
    marketplace: {
      title: 'Marketplace',
      subtitle: 'Buy and sell stickers with other collectors',
      listings: 'Listings',
      createListing: 'Create Listing',
      buyNow: 'Buy Now',
      makeOffer: 'Make Offer',
      price: 'Price',
      quantity: 'Quantity',
      seller: 'Seller',
      listed: 'Listed',
      expires: 'Expires',
      noListings: 'No listings available',
      noListingsDesc: 'Be the first to list a sticker!',
      filterByRarity: 'Filter by Rarity',
      filterByPrice: 'Filter by Price',
      priceRange: 'Price Range',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      sortBy: 'Sort by',
      newest: 'Newest',
      oldest: 'Oldest',
      lowestPrice: 'Lowest Price',
      highestPrice: 'Highest Price',
      listingCreated: 'Listing created successfully',
      listingCancelled: 'Listing cancelled',
      itemSold: 'Item sold successfully',
      yourListings: 'Your Listings',
      activeListings: 'Active Listings',
      soldListings: 'Sold Listings',
      totalEarnings: 'Total Earnings',
      averagePrice: 'Average Price',
    },
    craft: {
      title: 'Crafting Station',
      subtitle: 'Exchange duplicate stickers for new ones',
      selectDuplicates: 'Select Duplicates',
      craftSticker: 'Craft Sticker',
      craftingCost: 'Crafting Cost',
      creditsNeeded: 'Credits Needed',
      availableCredits: 'Available Credits',
      craftButton: 'Craft Now',
      craftingInProgress: 'Crafting in progress...',
      craftSuccess: 'Sticker crafted successfully!',
      craftError: 'Failed to craft sticker',
      noDuplicates: 'No duplicates available',
      noDuplicatesDesc: 'Open more packs to get duplicates!',
      rarityGuide: 'Rarity Guide',
      commonCraft: 'Common (1 Credit)',
      rareCraft: 'Rare (5 Credits)',
      epicCraft: 'Epic (20 Credits)',
      legendaryCraft: 'Legendary (60 Credits)',
      creditValue: 'Credit Value',
      selectAtLeast: 'Select at least {count} credits',
      randomSticker: 'Random Sticker',
      guaranteedLegendary: 'Guaranteed Legendary (100 Credits)',
    },
    rewards: {
      title: 'Rewards',
      subtitle: 'Claim daily rewards and earn badges',
      dailyLogin: 'Daily Login',
      dailyLoginDesc: 'Claim free credits every day',
      claimReward: 'Claim Reward',
      claimed: 'Claimed',
      nextReward: 'Next Reward',
      streakBonus: 'Streak Bonus',
      badges: 'Badges',
      badgeEarned: 'Badge Earned!',
      badgeDesc: 'Badge Description',
      claimBadge: 'Claim Badge',
      claimedBadges: 'Claimed Badges',
      availableBadges: 'Available Badges',
      requirements: 'Requirements',
      bonusCredits: 'Bonus Credits',
      specialPacks: 'Special Packs',
      exclusiveAccess: 'Exclusive Access',
      loginStreak: 'Login Streak',
      days: 'days',
      week: 'week',
      month: 'month',
    },
    history: {
      title: 'History',
      subtitle: 'View your activity history',
      packOpenings: 'Pack Openings',
      purchases: 'Purchases',
      sales: 'Sales',
      crafts: 'Crafts',
      claims: 'Claims',
      noHistory: 'No history yet',
      noHistoryDesc: 'Your activity will appear here',
      date: 'Date',
      type: 'Type',
      details: 'Details',
      txHash: 'Transaction Hash',
      status: 'Status',
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      viewTransaction: 'View Transaction',
    },
    og: {
      title: 'OG Stickers',
      subtitle: 'Exclusive OG edition stickers',
      ogStickers: 'OG Stickers',
      ogStickersDesc: 'Limited edition stickers for early supporters',
      limitedEdition: 'Limited Edition',
      totalSupply: 'Total Supply',
      claimOgPack: 'Claim OG Pack',
      claimOgPackDesc: 'Exclusive pack for verified OG sticker holders',
      ogHolders: 'OG Holders',
      verifyOwnership: 'Verify Ownership',
      alreadyClaimed: 'Already Claimed',
      claimSuccess: 'OG Pack claimed successfully!',
      claimError: 'Failed to claim OG Pack',
      connectToClaim: 'Connect wallet to verify OG status',
    },
    footer: {
      copyright: '© 2024 NFT Sticker Album. Season 1',
      poweredBy: 'Powered by Polygon',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      contact: 'Contact',
      discord: 'Discord',
      twitter: 'Twitter',
      telegram: 'Telegram',
    },
    errors: {
      walletNotConnected: 'Please connect your wallet',
      walletConnectionFailed: 'Failed to connect wallet',
      transactionFailed: 'Transaction failed',
      insufficientBalance: 'Insufficient balance',
      networkError: 'Network error',
      unknownError: 'An unknown error occurred',
      loadingError: 'Failed to load data',
      notFound: 'Not Found',
      pageNotFound: 'The page you\'re looking for doesn\'t exist',
      goHome: 'Go Home',
    },
  },
  pt: {
    common: {
      home: 'Início',
      album: 'Álbum',
      packs: 'Pacotes',
      inventory: 'Inventário',
      marketplace: 'Mercado',
      craft: 'Craftar',
      rewards: 'Recompensas',
      history: 'Histórico',
      og: 'OG',
      connectWallet: 'Conectar Carteira',
      wrongNetwork: 'Rede Errada',
      connected: 'Conectado',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      close: 'Fechar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      viewAll: 'Ver Todos',
      viewDetails: 'Ver Detalhes',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      clear: 'Limpar',
      copy: 'Copiar',
      copied: 'Copiado!',
      share: 'Compartilhar',
      download: 'Baixar',
      refresh: 'Atualizar',
      tryAgain: 'Tentar Novamente',
      noResults: 'Nenhum resultado encontrado',
      comingSoon: 'Em Breve',
      poweredBy: 'Powered by',
      season: 'Temporada',
    },
    home: {
      title: 'Mooby Stickers',
      subtitle: 'Colete, Troque e Complete Seu Álbum de Stickers NFT',
      collectStickers: 'Colete Stickers de Edição Limitada',
      completeAlbum: 'Complete Seu Álbum',
      startCollecting: 'Começar a Colecionar',
      viewAlbum: 'Ver Álbum',
      dailyRewards: 'Recompensas Diárias',
      openPacks: 'Abrir Pacotes',
      featuredPacks: 'Pacotes em Destaque',
      latestOpenings: 'Últimas Aberturas de Pacotes',
      communityHighlights: 'Destaques da Comunidade',
      totalCollectors: 'Total de Colecionadores',
      stickersCollected: 'Stickers Coletados',
      albumsCompleted: 'Álbuns Completos',
      ctaTitle: 'Pronto para Começar sua Coleção?',
      ctaSubtitle: 'Junte-se a milhares de colecionadores construindo seus álbuns de stickers digitais',
      ctaButton: 'Comece Agora',
      howItWorks: 'Como Funciona',
      step1Title: 'Conecte sua Carteira',
      step1Desc: 'Conecte sua carteira Polygon para começar a colecionar stickers',
      step2Title: 'Abra Pacotes',
      step2Desc: 'Compre e abra pacotes para descobrir stickers raros e lendários',
      step3Title: 'Complete Seu Álbum',
      step3Desc: 'Troque duplicatas e complete todos os 300 stickers para desbloquear recompensas',
      statsTitle: 'Estatísticas da Comunidade',
    },
    album: {
      title: 'Álbum de Stickers',
      pageOf: 'Página {current} de {total}',
      totalStickers: 'Total de Stickers',
      collected: 'Coletados',
      missing: 'Faltando',
      progress: 'Progresso',
      rarity: 'Raridade',
      filterAll: 'Todos',
      filterCollected: 'Coletados',
      filterMissing: 'Faltando',
      sortBy: 'Ordenar por',
      sortNumber: 'Número',
      sortRarity: 'Raridade',
      pageProgress: 'Progresso da Página',
      albumComplete: 'Álbum Completo!',
      albumCompleteDesc: 'Parabéns! Você coletou todos os 300 stickers!',
      stickerDetails: 'Detalhes do Sticker',
      quantity: 'Quantidade',
      duplicate: 'Duplicata',
      duplicates: 'Duplicatas',
      craftValue: 'Valor de Craft',
      viewInMarketplace: 'Ver no Mercado',
    },
    packs: {
      title: 'Pacotes de Stickers',
      subtitle: 'Compre pacotes para coletar novos stickers',
      basicPack: 'Pacote Básico',
      basicPackDesc: 'Contém 5 stickers aleatórios com alta chance de comuns',
      silverPack: 'Pacote Prata',
      silverPackDesc: 'Contém 5 stickers aleatórios com melhores chances de raros',
      goldPack: 'Pacote Ouro',
      goldPackDesc: 'Contém 5 stickers aleatórios com chances aumentadas de épicos e lendários',
      openPack: 'Abrir Pacote',
      buyingFrom: 'Comprando de',
      price: 'Preço',
      perPack: 'por pacote',
      available: 'Disponível',
      sold: 'Vendido',
      limitedEdition: 'Edição Limitada',
      new: 'Novo',
      popular: 'Popular',
      purchasePack: 'Comprar Pacote',
      packOpened: 'Pacote Aberto!',
      stickersReceived: 'Você recebeu {count} stickers',
      viewingPack: 'Visualizando Pacote',
      ogPack: 'Pacote OG',
      ogPackDesc: 'Pacote exclusivo para detentores de stickers OG',
      ogPackTitle: 'Pacote para Detentores OG',
    },
    inventory: {
      title: 'Inventário',
      subtitle: 'Gerencie sua coleção de stickers',
      totalStickers: 'Total de Stickers',
      totalDuplicates: 'Total de Duplicatas',
      stickers: 'Stickers',
      duplicates: 'Duplicatas',
      filterByRarity: 'Filtrar por Raridade',
      filterByPage: 'Filtrar por Página',
      allRarities: 'Todas as Raridades',
      allPages: 'Todas as Páginas',
      searchSticker: 'Buscar sticker...',
      noStickers: 'Nenhum sticker no inventário',
      noStickersDesc: 'Comece a colecionar abrindo alguns pacotes!',
      duplicateCount: '{count} duplicatas',
      crafting: 'Craftando',
      useForCrafting: 'Usar para Craftar',
      selected: 'Selecionado',
      convertToCredits: 'Converter em Créditos',
    },
    marketplace: {
      title: 'Mercado',
      subtitle: 'Compre e venda stickers com outros colecionadores',
      listings: 'Anúncios',
      createListing: 'Criar Anúncio',
      buyNow: 'Comprar Agora',
      makeOffer: 'Fazer Oferta',
      price: 'Preço',
      quantity: 'Quantidade',
      seller: 'Vendedor',
      listed: 'Anunciado',
      expires: 'Expira',
      noListings: 'Nenhum anúncio disponível',
      noListingsDesc: 'Seja o primeiro a anunciar um sticker!',
      filterByRarity: 'Filtrar por Raridade',
      filterByPrice: 'Filtrar por Preço',
      priceRange: 'Faixa de Preço',
      minPrice: 'Preço Mínimo',
      maxPrice: 'Preço Máximo',
      sortBy: 'Ordenar por',
      newest: 'Mais Recente',
      oldest: 'Mais Antigo',
      lowestPrice: 'Menor Preço',
      highestPrice: 'Maior Preço',
      listingCreated: 'Anúncio criado com sucesso',
      listingCancelled: 'Anúncio cancelado',
      itemSold: 'Item vendido com sucesso',
      yourListings: 'Seus Anúncios',
      activeListings: 'Anúncios Ativos',
      soldListings: 'Anúncios Vendidos',
      totalEarnings: 'Ganhos Totais',
      averagePrice: 'Preço Médio',
    },
    craft: {
      title: 'Estação de Craft',
      subtitle: 'Troque stickers duplicados por novos',
      selectDuplicates: 'Selecione Duplicatas',
      craftSticker: 'Craftar Sticker',
      craftingCost: 'Custo de Craft',
      creditsNeeded: 'Créditos Necessários',
      availableCredits: 'Créditos Disponíveis',
      craftButton: 'Craftar Agora',
      craftingInProgress: 'Craftando...',
      craftSuccess: 'Sticker craftado com sucesso!',
      craftError: 'Falha ao craftar sticker',
      noDuplicates: 'Nenhuma duplicata disponível',
      noDuplicatesDesc: 'Abra mais pacotes para obter duplicatas!',
      rarityGuide: 'Guia de Raridade',
      commonCraft: 'Comum (1 Crédito)',
      rareCraft: 'Raro (5 Créditos)',
      epicCraft: 'Épico (20 Créditos)',
      legendaryCraft: 'Lendário (60 Créditos)',
      creditValue: 'Valor de Crédito',
      selectAtLeast: 'Selecione pelo menos {count} créditos',
      randomSticker: 'Sticker Aleatório',
      guaranteedLegendary: 'Lendário Garantido (100 Créditos)',
    },
    rewards: {
      title: 'Recompensas',
      subtitle: 'Resgate recompensas diárias e ganhe badges',
      dailyLogin: 'Login Diário',
      dailyLoginDesc: 'Resgate créditos grátis todos os dias',
      claimReward: 'Resgatar Recompensa',
      claimed: 'Resgatado',
      nextReward: 'Próxima Recompensa',
      streakBonus: 'Bônus de Sequência',
      badges: 'Badges',
      badgeEarned: 'Badge Obtido!',
      badgeDesc: 'Descrição do Badge',
      claimBadge: 'Resgatar Badge',
      claimedBadges: 'Badges Resgatados',
      availableBadges: 'Badges Disponíveis',
      requirements: 'Requisitos',
      bonusCredits: 'Créditos Bônus',
      specialPacks: 'Pacotes Especiais',
      exclusiveAccess: 'Acesso Exclusivo',
      loginStreak: 'Sequência de Login',
      days: 'dias',
      week: 'semana',
      month: 'mês',
    },
    history: {
      title: 'Histórico',
      subtitle: 'Veja seu histórico de atividades',
      packOpenings: 'Aberturas de Pacotes',
      purchases: 'Compras',
      sales: 'Vendas',
      crafts: 'Crafts',
      claims: 'Resgates',
      noHistory: 'Nenhum histórico ainda',
      noHistoryDesc: 'Suas atividades aparecerão aqui',
      date: 'Data',
      type: 'Tipo',
      details: 'Detalhes',
      txHash: 'Hash da Transação',
      status: 'Status',
      completed: 'Concluído',
      pending: 'Pendente',
      failed: 'Falhou',
      viewTransaction: 'Ver Transação',
    },
    og: {
      title: 'Stickres OG',
      subtitle: 'Stickers de edição exclusiva OG',
      ogStickers: 'Stickers OG',
      ogStickersDesc: 'Stickers de edição limitada para apoiadores iniciais',
      limitedEdition: 'Edição Limitada',
      totalSupply: 'Oferta Total',
      claimOgPack: 'Resgatar Pacote OG',
      claimOgPackDesc: 'Pacote exclusivo para detentores verificados de stickers OG',
      ogHolders: 'Detentores OG',
      verifyOwnership: 'Verificar Propriedade',
      alreadyClaimed: 'Já Resgatado',
      claimSuccess: 'Pacote OG resgatado com sucesso!',
      claimError: 'Falha ao resgatar Pacote OG',
      connectToClaim: 'Conecte a carteira para verificar status OG',
    },
    footer: {
      copyright: '© 2024 Álbum de Stickers NFT. Temporada 1',
      poweredBy: 'Powered by Polygon',
      privacyPolicy: 'Política de Privacidade',
      termsOfService: 'Termos de Serviço',
      contact: 'Contato',
      discord: 'Discord',
      twitter: 'Twitter',
      telegram: 'Telegram',
    },
    errors: {
      walletNotConnected: 'Por favor, conecte sua carteira',
      walletConnectionFailed: 'Falha ao conectar carteira',
      transactionFailed: 'Transação falhou',
      insufficientBalance: 'Saldo insuficiente',
      networkError: 'Erro de rede',
      unknownError: 'Ocorreu um erro desconhecido',
      loadingError: 'Falha ao carregar dados',
      notFound: 'Não Encontrado',
      pageNotFound: 'A página que você procura não existe',
      goHome: 'Voltar ao Início',
    },
  },
};
