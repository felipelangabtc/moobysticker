/**
 * Main Layout Component
 * Wraps all pages with header and footer
 */

import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useTranslation } from '@/hooks/useTranslation';

export function MainLayout() {
  const t = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t.footer.copyright} - {t.footer.poweredBy} Polygon.</p>
        </div>
      </footer>
    </div>
  );
}
