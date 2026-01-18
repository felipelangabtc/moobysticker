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
import HomePage from '@/pages/HomePage';
import AlbumPage from '@/pages/AlbumPage';
import PacksPage from '@/pages/PacksPage';
import NotFound from '@/pages/NotFound';

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/inventory" element={<AlbumPage />} />
            <Route path="/craft" element={<HomePage />} />
            <Route path="/rewards" element={<HomePage />} />
            <Route path="/history" element={<HomePage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
