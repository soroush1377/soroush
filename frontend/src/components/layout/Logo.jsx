import { Link } from 'react-router-dom';

import { classNames } from '../../lib/format.js';

/**
 * Brand mark: a minimal architectural house with three champagne bars, set
 * beside the Horizon Properties wordmark.
 */
export default function Logo({ tone = 'dark', className, onClick }) {
  const light = tone === 'light';

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Horizon Properties — home"
      className={classNames('group inline-flex items-center gap-3', className)}
    >
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M5.5 18.4 20 6.6l14.5 11.8"
          fill="none"
          stroke="#C5A059"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <path
          d="M10.4 20.6v12.9h19.2V20.6"
          fill="none"
          stroke={light ? '#F9F7F3' : '#0A192F'}
          strokeWidth="1.7"
          strokeLinecap="square"
          className="transition-colors duration-300"
        />
        <path
          d="M14.6 23.4v10.1M20 23.4v10.1M25.4 23.4v10.1"
          stroke="#C5A059"
          strokeWidth="1.3"
          strokeLinecap="square"
        />
      </svg>

      <span className="flex flex-col">
        <span
          className={classNames(
            'font-display text-[0.98rem] font-extrabold uppercase leading-none tracking-[0.14em]',
            light ? 'text-white' : 'text-navy',
          )}
        >
          Horizon
        </span>
        <span className="mt-1 font-display text-[0.55rem] font-semibold uppercase leading-none tracking-[0.32em] text-champagne">
          Properties
        </span>
      </span>
    </Link>
  );
}
