import { Link } from 'react-router-dom';

import { COMPANY, NAV_LINKS } from '../../lib/content.js';
import Icon from '../ui/Icon.jsx';
import NewsletterForm from '../inquiry/NewsletterForm.jsx';
import Logo from './Logo.jsx';

const SOCIAL_ICONS = {
  Instagram: 'instagram',
  LinkedIn: 'linkedin',
  Facebook: 'facebook',
  YouTube: 'youtube',
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/70">
      <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-[0.92rem] leading-relaxed text-white/60">
            A private real estate agency representing exceptional homes and considered investments
            across prime US markets since {COMPANY.founded}.
          </p>
          <ul className="mt-6 flex items-center gap-3">
            {COMPANY.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${COMPANY.name} on ${social.label}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-300 ease-premium hover:border-champagne hover:text-champagne"
                >
                  <Icon name={SOCIAL_ICONS[social.label] || 'arrowRight'} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="font-display text-label-sm font-semibold uppercase text-champagne">Explore</h2>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-[0.92rem] text-white/65 transition-colors duration-300 ease-premium hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/saved"
                className="text-[0.92rem] text-white/65 transition-colors duration-300 ease-premium hover:text-white"
              >
                Saved
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-display text-label-sm font-semibold uppercase text-champagne">Contact</h2>
          <ul className="mt-5 space-y-4 text-[0.92rem]">
            <li>
              <a
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-2.5 text-white/75 transition-colors duration-300 ease-premium hover:text-white"
              >
                <Icon name="phone" size={17} className="text-champagne" />
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2.5 text-white/75 transition-colors duration-300 ease-premium hover:text-white"
              >
                <Icon name="mail" size={17} className="text-champagne" />
                {COMPANY.email}
              </a>
            </li>
            <li className="flex gap-2.5 text-white/60">
              <Icon name="mapPin" size={17} className="mt-0.5 shrink-0 text-champagne" />
              <address className="not-italic leading-relaxed">
                {COMPANY.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
            <li className="flex gap-2.5 text-white/60">
              <Icon name="clock" size={17} className="mt-0.5 shrink-0 text-champagne" />
              <span>{COMPANY.hours}</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <NewsletterForm tone="dark" />
          <p className="mt-2 text-[0.78rem] leading-relaxed text-white/45">
            Quarterly market notes and new listings. No more than one email a month.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-6 text-[0.8rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {COMPANY.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 font-display text-[0.78rem] font-semibold text-white/70 transition-colors duration-300 ease-premium hover:text-white"
          >
            Back to top
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
