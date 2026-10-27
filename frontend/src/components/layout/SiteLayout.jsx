import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { classNames } from '../../lib/format.js';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function SiteLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // Every navigation starts at the top of the new page.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-ui focus:bg-navy focus:px-5 focus:py-3 focus:font-display focus:text-[0.85rem] focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className={classNames('flex-1', !isHome && 'pt-[68px] lg:pt-[76px]')}>
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
