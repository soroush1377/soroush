import { useFavorites } from '../../context/FavoritesContext.jsx';
import { classNames } from '../../lib/format.js';
import Icon from './Icon.jsx';

/**
 * Save/unsave control. Persists to the browser so saved homes survive reloads.
 * `variant="onImage"` is the glass treatment used over photography.
 */
export default function FavoriteButton({ property, variant = 'onImage', className, size = 18 }) {
  const { isFavorite, toggle } = useFavorites();
  const slug = property?.slug;
  if (!slug) return null;

  const saved = isFavorite(slug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={`${saved ? 'Remove' : 'Save'} ${property.name} ${saved ? 'from' : 'to'} your saved properties`}
      title={saved ? 'Remove from saved' : 'Save property'}
      className={classNames(
        'group/fav inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-premium',
        variant === 'onImage'
          ? 'border-white/35 bg-white/85 text-navy shadow-[0_10px_24px_-14px_rgba(10,25,47,0.7)] backdrop-blur-md hover:bg-white'
          : 'border-navy/15 bg-white text-navy hover:border-navy/35',
        saved && 'text-champagne-deep',
        className,
      )}
    >
      <Icon
        name={saved ? 'heartFilled' : 'heart'}
        size={size}
        className="transition-transform duration-300 ease-premium group-hover/fav:scale-110"
      />
    </button>
  );
}
