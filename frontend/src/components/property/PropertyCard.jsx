import { Link } from 'react-router-dom';

import { classNames, formatBaths } from '../../lib/format.js';
import FavoriteButton from '../ui/FavoriteButton.jsx';
import Icon from '../ui/Icon.jsx';
import PropertyStats from './PropertyStats.jsx';

const useFirstImage = (property) =>
  property?.images?.[0] || { src: '/images/about-main.jpg', alt: property?.name || 'Property' };

/**
 * The single property card used by the featured carousel, the browse grid,
 * saved homes and similar-property rails.
 *
 * variant="overlay" — photography with an in-image information panel.
 * variant="standard" — bordered card with the details below the image.
 */
export default function PropertyCard({ property, variant = 'standard', className, priority = false }) {
  const image = useFirstImage(property);

  if (variant === 'overlay') {
    return (
      <article className={classNames('group relative h-full overflow-hidden rounded-image bg-navy', className)}>
        <Link
          to={`/properties/${property.slug}`}
          className="block h-full focus-visible:outline-offset-4"
          aria-label={`${property.name}, ${property.location}, ${property.priceLabel}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
            <p className="font-display text-label-sm font-semibold uppercase text-champagne-soft">
              {property.type}
            </p>
            <h3 className="mt-2 font-display text-[1.35rem] font-bold leading-snug text-white lg:text-[1.5rem]">
              {property.name}
            </h3>
            <p className="mt-2 inline-flex items-center gap-2 text-[0.85rem] text-white/75">
              <Icon name="mapPin" size={16} className="text-champagne-soft" />
              {property.location}
            </p>
            <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/20 pt-4">
              <PropertyStats property={property} tone="light" className="gap-x-4 text-[0.78rem]" />
              <span className="font-display text-[1.05rem] font-bold text-white">{property.priceLabel}</span>
            </div>
          </div>
        </Link>

        <FavoriteButton
          property={property}
          className="absolute right-5 top-5 h-11 w-11"
        />
      </article>
    );
  }

  return (
    <article
      className={classNames(
        'group relative flex h-full flex-col overflow-hidden rounded-image border border-navy/10 bg-white transition-shadow duration-500 ease-premium hover:shadow-lift',
        className,
      )}
    >
      <Link
        to={`/properties/${property.slug}`}
        className="block overflow-hidden"
        aria-label={`${property.name}, ${property.location}, ${property.priceLabel}`}
      >
        <img
          src={image.src}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.045]"
        />
      </Link>

      <span className="pointer-events-none absolute left-4 top-4 rounded-ui bg-white/92 px-3 py-1.5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy backdrop-blur-md">
        {property.status}
      </span>

      <FavoriteButton property={property} className="absolute right-4 top-4" />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.2rem] font-bold leading-snug text-navy">
          <Link to={`/properties/${property.slug}`} className="link-underline">
            {property.name}
          </Link>
        </h3>

        <p className="mt-2 inline-flex items-center gap-2 text-[0.85rem] text-ink-soft">
          <Icon name="mapPin" size={16} className="text-champagne-deep" />
          {property.location}
        </p>

        <p className="mt-4 line-clamp-2 text-[0.92rem] leading-relaxed text-ink-soft">{property.summary}</p>

        <div className="mt-auto pt-6">
          <div className="hairline" />
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="font-display text-[1.05rem] font-bold text-navy">{property.priceLabel}</span>
            <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-champagne-deep">
              {property.type}
            </span>
          </div>
          <PropertyStats
            property={property}
            className="mt-4 gap-x-4 border-t border-navy/10 pt-4 text-[0.78rem]"
          />
          <span className="sr-only">
            {property.beds} bedrooms, {formatBaths(property.baths)} bathrooms, {property.sqft} square feet
          </span>
        </div>
      </div>
    </article>
  );
}
