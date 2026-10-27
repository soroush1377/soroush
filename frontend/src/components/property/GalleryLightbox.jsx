import { useEffect } from 'react';

import { classNames } from '../../lib/format.js';
import { CircleButton } from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * Fullscreen image viewer for a property gallery: arrow keys, Escape, and
 * thumbnail navigation.
 */
export default function GalleryLightbox({
  images = [],
  index = 0,
  onChangeIndex,
  onClose,
  propertyName = 'Property',
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onChangeIndex((index + 1) % images.length);
      if (event.key === 'ArrowLeft') onChangeIndex((index - 1 + images.length) % images.length);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, index, onChangeIndex, onClose]);

  if (images.length === 0) return null;
  const image = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${propertyName} image gallery`}
      className="fixed inset-0 z-[120] flex flex-col bg-navy/97"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-white/70">
          {index + 1} / {images.length}
        </p>
        <CircleButton
          icon="close"
          label="Close image viewer"
          variant="outline-light"
          onClick={onClose}
          data-autofocus
        />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-2 sm:px-10">
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className="max-h-[68vh] w-auto max-w-full animate-image-in rounded-image object-contain sm:max-h-[74vh]"
        />

        {images.length > 1 ? (
          <>
            <CircleButton
              icon="chevronLeft"
              label="Previous image"
              variant="outline-light"
              size="lg"
              onClick={() => onChangeIndex((index - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 sm:left-6"
            />
            <CircleButton
              icon="chevronRight"
              label="Next image"
              variant="outline-light"
              size="lg"
              onClick={() => onChangeIndex((index + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-6"
            />
          </>
        ) : null}
      </div>

      <p className="px-6 pb-2 text-center text-[0.85rem] text-white/70 sm:px-10">{image.alt}</p>

      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 pb-6 pt-4 sm:px-8">
        {images.map((item, itemIndex) => (
          <button
            key={item.src}
            type="button"
            onClick={() => onChangeIndex(itemIndex)}
            aria-label={`Show image ${itemIndex + 1}`}
            aria-current={itemIndex === index}
            className={classNames(
              'h-16 w-24 shrink-0 snap-start overflow-hidden rounded-ui border transition-all duration-300 ease-premium',
              itemIndex === index
                ? 'border-champagne opacity-100'
                : 'border-white/20 opacity-60 hover:opacity-100',
            )}
          >
            <img src={item.thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      <span className="sr-only">
        Use the left and right arrow keys to move through the gallery, and Escape to close it.
      </span>
    </div>
  );
}
