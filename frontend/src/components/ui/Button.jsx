import { Link } from 'react-router-dom';

import { classNames } from '../../lib/format.js';
import Icon from './Icon.jsx';

const VARIANTS = {
  primary:
    'bg-navy text-white hover:bg-navy-700 shadow-[0_14px_34px_-22px_rgba(10,25,47,0.85)] hover:shadow-[0_18px_40px_-20px_rgba(10,25,47,0.65)]',
  outline: 'border border-navy/20 text-navy hover:border-navy hover:bg-navy/[0.04]',
  'outline-light': 'border border-white/45 text-white hover:border-white hover:bg-white/10',
  light: 'bg-white text-navy hover:bg-ivory',
  gold: 'bg-champagne text-navy hover:bg-champagne-soft',
  ghost: 'text-navy hover:text-champagne-deep',
  'ghost-light': 'text-white/85 hover:text-white',
};

const SIZES = {
  sm: 'min-h-[44px] px-4 text-[0.8rem]',
  md: 'min-h-[48px] px-6 text-[0.85rem]',
  lg: 'min-h-[52px] px-7 text-[0.9rem]',
};

/**
 * One button for every CTA: renders a router Link, an anchor or a button
 * depending on the props it is given.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconLeft,
  full = false,
  className,
  type = 'button',
  ...rest
}) {
  const classes = classNames(
    'group/btn inline-flex items-center justify-center gap-2.5 rounded-ui font-display font-semibold leading-none transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    full && 'w-full',
    className,
  );

  const content = (
    <>
      {iconLeft ? <Icon name={iconLeft} size={18} /> : null}
      <span>{children}</span>
      {icon ? (
        <Icon
          name={icon}
          size={18}
          className="transition-transform duration-300 ease-premium group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}

const CIRCLE_VARIANTS = {
  light: 'border border-navy/10 bg-white/90 text-navy backdrop-blur-md hover:bg-white hover:border-navy/25',
  dark: 'bg-navy text-white hover:bg-navy-700',
  gold: 'bg-champagne text-navy hover:bg-champagne-soft',
  'outline-light': 'border border-white/50 bg-navy/25 text-white backdrop-blur-md hover:bg-white hover:text-navy',
};

const CIRCLE_SIZES = {
  sm: 'h-11 w-11',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
};

/** Round icon control — carousel arrows, gallery controls, lightbox. */
export function CircleButton({
  icon,
  label,
  variant = 'light',
  size = 'md',
  className,
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={classNames(
        'inline-flex items-center justify-center rounded-full transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-40',
        CIRCLE_VARIANTS[variant],
        CIRCLE_SIZES[size],
        className,
      )}
      {...rest}
    >
      {children || <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
    </button>
  );
}
