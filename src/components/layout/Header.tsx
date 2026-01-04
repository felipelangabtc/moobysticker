/**
 * Main Navigation Header Component
 * Responsive navigation with wallet connection
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAlbumStore, useProgress } from '@/stores/albumStore';
import { ProgressBar } from '@/components/ui/progress-ring';
import {
  BookOpen,
  Package,
  Backpack,
  Flame,
  Trophy,
  History,
  Menu,
  X,
  Wallet,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { path: '/', label: 'Home', icon: BookOpen },
  { path: '/album', label: 'Album', icon: BookOpen },
  { path: '/packs', label: 'Packs', icon: Package },
  { path: '/inventory', label: 'Inventory', icon: Backpack },
  { path: '/craft', label: 'Craft', icon: Flame },
  { path: '/rewards', label: 'Rewards', icon: Trophy },
  { path: '/history', label: 'History', icon: History },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progress = useProgress();
  const connectedAddress = useAlbumStore((state) => state.connectedAddress);
  const setConnectedAddress = useAlbumStore((state) => state.setConnectedAddress);

  const handleConnect = () => {
    const mockAddress = '0x1234...5678';
    setConnectedAddress(mockAddress);
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-yellow-600">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden font-display text-xl font-bold text-gradient-gold sm:block">
            NFT Album
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.slice(1).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Progress indicator (when connected) */}
          {connectedAddress && (
            <div className="hidden items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 sm:flex">
              <ProgressBar
                value={progress.totalCollected}
                max={300}
                size="sm"
                className="w-20"
              />
              <span className="text-xs text-muted-foreground">
                {progress.totalCollected}/300
              </span>
            </div>
          )}

          {/* Wallet button */}
          {connectedAddress ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {truncateAddress(connectedAddress)}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDisconnect}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleConnect} className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 bg-background lg:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
