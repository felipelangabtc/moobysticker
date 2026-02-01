/**
 * App Router Configuration
 * Main application entry point with Web3 providers
 */

import '@rainbow-me/rainbowkit/styles.css';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Web3Provider } from '@/providers/Web3Provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import HomePage from '@/pages/HomePage';
import AlbumPage from '@/pages/AlbumPage';
import OGPage from '@/pages/OGPage';
import PacksPage from '@/pages/PacksPage';
import InventoryPage from '@/pages/InventoryPage';
import MarketplacePage from '@/pages/MarketplacePage';
import CraftPage from '@/pages/CraftPage';
import RewardsPage from '@/pages/RewardsPage';
import HistoryPage from '@/pages/HistoryPage';
import NotFound from '@/pages/NotFound';

const App = () => (
  <Web3Provider>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/og" element={<OGPage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/craft" element={<CraftPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </Web3Provider>
);

export default App;
