import { useState } from 'react';

import { ABOUT_COPY } from '../../lib/content.js';
import Button, { CircleButton } from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

/**
 * Editorial image pair with a circular advance control, hover zoom and counter.
 * Exported so the About page can reuse the same composition.
 */
export function AboutImagePair({ slides }) {
  const [index, setIndex] = useState(0);
  const main = slides[index];
  const secondary = slides[(index + 1) % slides.length];

  const go = (direction) => setIndex((current) => (current + direction + slides.length) % slides.length);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)]">
        <figure className="group relative overflow-hidden rounded-image bg-navy/5">
          <img
            key={main.src}
            src={main.src}
            alt={main.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full animate-image-in object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
          />
        </figure>

        <figure className="group hidden overflow-hidden rounded-image bg-navy/5 sm:block">
          <img
            key={secondary.src}
            src={secondary.src}
            alt={secondary.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full animate-image-in object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.04]"
          />
        </figure>
      </div>

      <CircleButton
        icon="chevronLeft"
        label="Previous image"
        onClick={() => go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 shadow-card sm:left-4"
      />
      <CircleButton
        icon="chevronRight"
        label="Next image"
        onClick={() => go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 shadow-card sm:-right-6"
      />

      <p className="mt-4 font-display text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
        {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </p>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading label={ABOUT_COPY.label} title={ABOUT_COPY.heading} />
          <p className="mt-6 max-w-prose text-body-lg text-ink-soft">{ABOUT_COPY.body}</p>
          <p className="mt-5 max-w-prose text-[0.98rem] leading-relaxed text-ink-soft/90">
            {ABOUT_COPY.secondary}
          </p>
          <Button to="/about" icon="arrowRight" className="mt-9">
            Learn More
          </Button>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <AboutImagePair slides={ABOUT_COPY.slides} />
        </Reveal>
      </div>
    </section>
  );
}
