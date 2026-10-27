import { classNames } from '../../lib/format.js';

/**
 * Single inline icon set (stroke based, 1.5px) so the UI never depends on an
 * icon font or an extra package.
 */
const PATHS = {
  phone: (
    <path d="M6.4 3.5h2.2l1.3 3.3-1.7 1.2a10.4 10.4 0 0 0 5.1 5.1l1.2-1.7 3.3 1.3v2.2a2 2 0 0 1-2.2 2A14.3 14.3 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  arrowRight: <path d="M4.5 12h15m0 0-5.6-5.6M19.5 12l-5.6 5.6" />,
  arrowLeft: <path d="M19.5 12h-15m0 0 5.6-5.6M4.5 12l5.6 5.6" />,
  chevronRight: <path d="m9.5 5.5 7 6.5-7 6.5" />,
  chevronLeft: <path d="m14.5 5.5-7 6.5 7 6.5" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  mapPin: (
    <>
      <path d="M12 21s6.5-5.4 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </>
  ),
  bed: (
    <>
      <path d="M3.5 18.5v-11M3.5 12.5h17v6M20.5 18.5v-4.6" />
      <path d="M3.5 10.5h7a2 2 0 0 1 2 2H3.5z" />
    </>
  ),
  bath: (
    <>
      <path d="M4 12.5h16v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <path d="M7 12.5V6.8A2.3 2.3 0 0 1 9.3 4.5c1.2 0 2 .7 2.3 1.8M8.5 20.5 7.5 19M15.5 20.5l1-1.5" />
    </>
  ),
  area: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M8.5 4v3M4 8.5h3M15.5 20v-3M20 15.5h-3" />
    </>
  ),
  heart: (
    <path d="M12 19.5s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.7c0 5-7.5 9.4-7.5 9.4Z" />
  ),
  heartFilled: (
    <path
      d="M12 19.5s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.7c0 5-7.5 9.4-7.5 9.4Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  filter: <path d="M4 6.5h16M7 12h10M10 17.5h4" />,
  check: <path d="m5 12.8 4.2 4.2L19 7.5" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="7.8" />
      <path d="M12 7.8V12l3 1.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.8" y="5.5" width="16.4" height="14" rx="1.5" />
      <path d="M3.8 10h16.4M8.5 3.8v3.4M15.5 3.8v3.4" />
    </>
  ),
  key: (
    <>
      <circle cx="8.4" cy="15.6" r="3.6" />
      <path d="m11 13 8-8M16.4 7.6 18.4 9.6M14.4 9.6l2 2" />
    </>
  ),
  expand: <path d="M9 4.5H4.5V9M15 4.5h4.5V9M9 19.5H4.5V15M15 19.5h4.5V15" />,
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  minus: <path d="M5.5 12h13" />,
  shield: <path d="M12 3.8 5.5 6.4v5.1c0 4 2.7 7.5 6.5 8.7 3.8-1.2 6.5-4.7 6.5-8.7V6.4z" />,
  star: (
    <path d="m12 4.5 2.3 5 5.2.6-3.9 3.6 1.1 5.3L12 16.4l-4.7 2.6 1.1-5.3-3.9-3.6 5.2-.6z" />
  ),
  building: (
    <>
      <path d="M4.5 20.5V6.2L12 3.5v17M12 20.5h7.5V9.8L12 7.2M7.5 9.5h1.5M7.5 13h1.5M7.5 16.5h1.5M15 12h1.5M15 15.5h1.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="2.4" />
      <path d="M8.2 10.5v6M8.2 7.9v.1M11.6 16.5v-3.4a2 2 0 0 1 4 0v3.4" />
    </>
  ),
  facebook: <path d="M14.6 8.4h2V5.6h-2a3.4 3.4 0 0 0-3.4 3.4v1.6H9.4v2.8h1.8v6.1h2.8v-6.1h2l.6-2.8h-2.6V9.4c0-.6.3-1 1-1Z" />,
  youtube: (
    <>
      <rect x="3.4" y="6.2" width="17.2" height="11.6" rx="3.4" />
      <path d="m10.6 9.8 4.4 2.2-4.4 2.2z" />
    </>
  ),
};

export default function Icon({ name, className, size = 20, strokeWidth = 1.5, title }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classNames('shrink-0', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
}
