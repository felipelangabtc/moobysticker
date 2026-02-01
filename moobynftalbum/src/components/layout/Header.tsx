/**
 * Main Navigation Header Component
 * Responsive navigation with real RainbowKit wallet connection
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/stores/albumStore';
import { ProgressBar } from '@/components/ui/progress-ring';
import {
  BookOpen,
  Package,
  Backpack,
  Flame,
  Trophy,
  History,
  Store,
  Menu,
  X,
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageToggle } from '@/components/ui/language-toggle';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progress = useProgress();
  const t = useTranslation();
  
  // Real wallet connection state from wagmi
  const { isConnected } = useAccount();

  const navItems = [
    { path: '/', label: t.common.home, icon: BookOpen },
    { path: '/album', label: t.common.album, icon: BookOpen },
    { path: '/packs', label: t.common.packs, icon: Package },
    { path: '/inventory', label: t.common.inventory, icon: Backpack },
    { path: '/marketplace', label: t.common.marketplace, icon: Store },
    { path: '/craft', label: t.common.craft, icon: Flame },
    { path: '/rewards', label: t.common.rewards, icon: Trophy },
    { path: '/history', label: t.common.history, icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-yellow-600">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden font-display text-xl font-bold text-gradient-gold sm:block">
            Mooby Stickers
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
          <LanguageToggle />

          {/* Progress indicator (when connected) */}
          {isConnected && (
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

          {/* RainbowKit Connect Button - Real wallet connection */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button onClick={openConnectModal} className="gap-2">
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button 
                          onClick={openChainModal} 
                          variant="destructive"
                          className="gap-2"
                        >
                          Wrong Network
                        </Button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        {/* Chain button */}
                        <Button
                          onClick={openChainModal}
                          variant="outline"
                          size="sm"
                          className="hidden gap-2 sm:flex"
                        >
                          {chain.hasIcon && (
                            <div
                              className="h-4 w-4 overflow-hidden rounded-full"
                              style={{ background: chain.iconBackground }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  className="h-4 w-4"
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </Button>

                        {/* Account button */}
                        <Button
                          onClick={openAccountModal}
                          variant="outline"
                          className="gap-2"
                        >
                          {account.displayName}
                          {account.displayBalance && (
                            <span className="hidden text-muted-foreground sm:inline">
                              ({account.displayBalance})
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

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
