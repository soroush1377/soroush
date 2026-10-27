import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { COMPANY, NAV_LINKS } from '../../lib/content.js';
import { classNames } from '../../lib/format.js';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import Icon from '../ui/Icon.jsx';
import Logo from './Logo.jsx';

const linkClass = ({ isActive }, light) =>
  classNames(
    'relative py-2 font-display text-[0.83rem] font-semibold transition-colors duration-300 ease-premium after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-champagne after:transition-all after:duration-300 after:ease-premium',
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full',
    light ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-navy',
    isActive && (light ? 'text-white' : 'text-navy'),
  );

export default function Header() {
  const { pathname } = useLocation();
  const { count } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  const transparent = pathname === '/' && !scrolled;

  // The home hero pins the viewport for its scroll-driven film, so the bar stays
  // transparent for that whole section and only turns solid once it is over.
  useEffect(() => {
    const onScroll = () => {
      const hero = pathname === '/' ? document.getElementById('home-hero') : null;
      // Transparent for as long as the sticky hero is still pinned (its bottom
      // edge below the fold), solid once the white section underneath arrives.
      const pinned = hero ? hero.getBoundingClientRect().bottom > window.innerHeight : false;
      setScrolled(!pinned && window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-premium',
        transparent ? 'bg-transparent' : 'bg-white/95 shadow-header backdrop-blur-md',
      )}
    >
      <div className="shell flex h-[68px] items-center justify-between gap-6 lg:h-[76px]">
        <Logo tone={transparent ? 'light' : 'dark'} />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex xl:gap-10">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={(state) => linkClass(state, transparent)}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/saved"
            aria-label={`Saved properties${count > 0 ? ` (${count})` : ''}`}
            className={classNames(
              'relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ease-premium',
              transparent
                ? 'border-white/35 text-white hover:border-white hover:bg-white/10'
                : 'border-navy/15 text-navy hover:border-navy/40 hover:bg-navy/[0.04]',
            )}
          >
            <Icon
              name={count > 0 ? 'heartFilled' : 'heart'}
              size={18}
              className={count > 0 && !transparent ? 'text-champagne-deep' : undefined}
            />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-champagne px-1 font-display text-[0.68rem] font-bold text-navy">
                {count}
              </span>
            ) : null}
          </Link>

          <a
            href={COMPANY.phoneHref}
            className={classNames(
              'hidden items-center gap-2.5 rounded-ui border px-4 py-3 font-display text-[0.82rem] font-semibold transition-all duration-300 ease-premium sm:inline-flex',
              transparent
                ? 'border-white/40 text-white hover:border-white hover:bg-white/10'
                : 'border-navy/20 text-navy hover:border-navy hover:bg-navy/[0.04]',
            )}
          >
            <Icon name="phone" size={17} className="text-champagne" />
            {COMPANY.phone}
          </a>

          <button
            type="button"
            ref={toggleRef}
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={classNames(
              'inline-flex h-11 w-11 items-center justify-center rounded-ui border transition-colors duration-300 ease-premium lg:hidden',
              transparent || menuOpen
                ? 'border-white/35 text-white hover:bg-white/10'
                : 'border-navy/15 text-navy hover:border-navy/40',
            )}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile navigation panel: always mounted so it can animate both ways. */}
      <div
        id="mobile-menu"
        className={classNames(
          'fixed inset-x-0 top-[68px] z-40 h-[calc(100dvh-68px)] origin-top bg-navy transition-all duration-400 ease-premium lg:hidden',
          menuOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0',
        )}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile" className="shell flex max-h-[calc(100dvh-68px)] flex-col gap-1 overflow-y-auto py-6">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              tabIndex={menuOpen ? 0 : -1}
              className={({ isActive }) =>
                classNames(
                  'flex items-center justify-between border-b border-white/10 py-4 font-display text-[1.05rem] font-semibold transition-colors duration-300',
                  isActive ? 'text-champagne' : 'text-white/85 hover:text-white',
                )
              }
            >
              {item.label}
              <Icon name="arrowRight" size={18} className="text-white/30" />
            </NavLink>
          ))}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={COMPANY.phoneHref}
              tabIndex={menuOpen ? 0 : -1}
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-ui border border-white/35 px-5 font-display text-[0.85rem] font-semibold text-white"
            >
              <Icon name="phone" size={17} className="text-champagne" />
              {COMPANY.phone}
            </a>
            <Link
              to="/properties"
              tabIndex={menuOpen ? 0 : -1}
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-ui bg-champagne px-5 font-display text-[0.85rem] font-semibold text-navy"
            >
              Browse properties
              <Icon name="arrowRight" size={18} />
            </Link>
            <p className="pt-2 text-[0.8rem] leading-relaxed text-white/50">
              {COMPANY.address.join(', ')} · {COMPANY.hours}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
