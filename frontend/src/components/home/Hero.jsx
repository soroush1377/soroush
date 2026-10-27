import { useEffect, useState } from 'react';

import HeroCopy from './HeroCopy.jsx';
import ScrollVideoHero from './ScrollVideoHero.jsx';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Still hero — the photograph on its own. This is the experience for anyone who
 * asks for reduced motion, and the visual the cinematic version degrades to.
 */
function StillHero() {
  return (
    <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-navy pt-[68px] lg:h-[calc(100svh-0px)] lg:max-h-[940px] lg:min-h-[700px] lg:pt-[76px]">
      <img
        src="/images/hero-dusk-villa.jpg"
        alt="Modern luxury villa with an illuminated infinity pool at dusk"
        {...{ fetchpriority: 'high' }}
        decoding="async"
        className="absolute inset-0 h-full w-full animate-image-in object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy/88 via-navy/45 to-navy/80"
        aria-hidden="true"
      />

      <HeroCopy className="shell relative z-10 -mt-6 flex w-full flex-col items-center text-center sm:-mt-10" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

/**
 * The home hero: a scroll-driven 3D film on the right device, the still frame
 * for visitors who prefer reduced motion.
 */
export default function Hero() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    const onChange = (event) => setReduced(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced ? <StillHero /> : <ScrollVideoHero />;
}
