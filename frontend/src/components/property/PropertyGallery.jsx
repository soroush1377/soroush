import { useEffect, useRef, useState } from 'react';

import { classNames } from '../../lib/format.js';
import { CircleButton } from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';

/**
 * Property gallery: an editorial primary image with a supporting column on
 * desktop, a swipeable strip with thumbnails on mobile, and a fullscreen viewer.
 */
export default function PropertyGallery({ images = [], propertyName = 'Property' }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mobileStrip = useRef(null);

  const count = images.length;
  const main = images[index] || images[0];

  useEffect(() => {
    if (!main) return;
    // Warm the next image so arrow navigation feels instant.
    const next = images[(index + 1) % count];
    if (next) {
      const preload = new Image();
      preload.src = next.src;
    }
  }, [count, images, index, main]);

  if (!main) return null;

  const go = (direction) => setIndex((current) => (current + direction + count) % count);

  const goTo = (target) => {
    setIndex(target);
    const strip = mobileStrip.current;
    const slide = strip?.children?.[target];
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  return (
    <>
      {/* Desktop: primary image plus two supporting tiles. */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-12">
        <div className="group relative col-span-8 overflow-hidden rounded-image bg-navy/5">
          <img
            key={main.src}
            src={main.src}
            alt={main.alt}
            className="aspect-[16/11] w-full animate-image-in object-cover"
            {...{ fetchpriority: 'high' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-ui bg-white/92 px-4 py-3 font-display text-[0.78rem] font-semibold text-navy backdrop-blur-md transition-colors duration-300 ease-premium hover:bg-white"
          >
            <Icon name="expand" size={17} />
            View all {count} photos
          </button>
          <CircleButton
            icon="chevronLeft"
            label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-5 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-premium group-hover:opacity-100 focus-visible:opacity-100"
          />
          <CircleButton
            icon="chevronRight"
            label="Next image"
            onClick={() => go(1)}
            className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-premium group-hover:opacity-100 focus-visible:opacity-100"
          />
        </div>

        <div className="col-span-4 grid grid-rows-2 gap-3">
          {[1, 2].map((offset) => {
            const tile = images[offset];
            if (!tile) return <div key={offset} className="rounded-image bg-navy/5" />;
            const isLast = offset === 2 && count > 3;
            return (
              <button
                key={tile.src}
                type="button"
                onClick={() => (isLast ? setLightboxOpen(true) : goTo(offset))}
                className="group relative overflow-hidden rounded-image bg-navy/5 text-left"
                aria-label={isLast ? `View all ${count} photos` : `Show image ${offset + 1}`}
              >
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
                />
                {isLast ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-navy/55 font-display text-[0.95rem] font-semibold text-white backdrop-blur-[1px]">
                    +{count - 2} more photos
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: swipeable strip with a thumbnail rail. */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-image bg-navy/5">
          <div
            ref={mobileStrip}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
            onScroll={(event) => {
              const { scrollLeft, clientWidth } = event.currentTarget;
              const next = Math.round(scrollLeft / Math.max(clientWidth, 1));
              if (next !== index) setIndex(Math.min(Math.max(next, 0), count - 1));
            }}
          >
            {images.map((image) => (
              <div key={image.src} className="w-full shrink-0 snap-center">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="pointer-events-none absolute left-4 top-4 rounded-ui bg-navy/70 px-3 py-1.5 font-display text-[0.7rem] font-semibold text-white backdrop-blur-md">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-ui bg-white/92 px-3.5 py-2.5 font-display text-[0.72rem] font-semibold text-navy backdrop-blur-md"
          >
            <Icon name="expand" size={16} />
            All photos
          </button>
        </div>

        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(imageIndex)}
              aria-label={`Show image ${imageIndex + 1}`}
              aria-current={imageIndex === index}
              className={classNames(
                'h-16 w-24 shrink-0 overflow-hidden rounded-ui border transition-all duration-300 ease-premium',
                imageIndex === index ? 'border-champagne' : 'border-navy/10 opacity-70',
              )}
            >
              <img src={image.thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen ? (
        <GalleryLightbox
          images={images}
          index={index}
          onChangeIndex={setIndex}
          onClose={() => setLightboxOpen(false)}
          propertyName={propertyName}
        />
      ) : null}
    </>
  );
}
