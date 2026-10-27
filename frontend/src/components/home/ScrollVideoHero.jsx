import { useEffect, useRef, useState } from 'react';

import { classNames } from '../../lib/format.js';
import HeroCopy from './HeroCopy.jsx';

/**
 * Scroll-scrubbed hero film.
 *
 * The section is 300vh tall and its 100vh stage is sticky, so the remaining
 * 200vh of scrolling maps 0 → 1 onto the video timeline:
 *
 *   scrollProgress = 0   → video.currentTime = 0
 *   scrollProgress = 0.5 → video.currentTime = duration / 2
 *   scrollProgress = 1   → video.currentTime = last frame
 *
 * The video never plays. `play()` is never called: the scroll position owns
 * `currentTime`, so stopping the scroll freezes that exact frame and scrolling
 * back up runs the scene backwards.
 *
 * Why it stays smooth:
 *  - scroll handlers only record a target progress (passive listeners, no
 *    layout writes and no React state);
 *  - one requestAnimationFrame loop is the only writer of `currentTime`, and it
 *    lerps towards that target so raw scroll deltas never become hard jumps;
 *  - a write is skipped unless the picture moved by more than MIN_SEEK_STEP,
 *    which keeps the browser from queueing hundreds of redundant seeks;
 *  - the loop parks itself as soon as it settles, so an idle page costs nothing.
 *
 * Encoding matters more than the JS here. Scrubbing decodes from the nearest
 * keyframe, so the delivered master (2 keyframes across 9s) would stutter.
 * `/public/videos/hero-scrub*.mp4` are re-encoded with a keyframe every 8
 * frames at 24fps (`-g 8 -keyint_min 8 -sc_threshold 0`), `+faststart`, no
 * audio track, ~1168×768 at CRF 23 (≈4 Mbps). Anything that replaces them
 * should keep a short GOP, a reasonable bitrate and faststart; long-GOP files
 * seek slowly no matter how the JS is written.
 */

const SECTION_HEIGHT = '300vh';
const SMOOTHING = 0.22; // lerp factor per frame — responsive but never jerky
const MIN_SEEK_STEP = 0.02; // seconds of footage before another seek is worth it
const TEXT_FADE_START = 0.16;
const TEXT_FADE_END = 0.34;
const VEIL_START = 0.82;

export default function ScrollVideoHero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const copyRef = useRef(null);
  const veilRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  // Chosen once at mount: phones get the lighter 854px cut. (`media` on a
  // <source> inside <video> is not honoured by browsers, so pick here.)
  const [filmSrc] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
      ? '/videos/hero-scrub-mobile.mp4'
      : '/videos/hero-scrub.mp4',
  );

  // Prepare the video: paint frame 0, reveal it, and never let it play.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reveal = () => {
      if (!video.duration) return;
      // A zero-length seek is ignored by some engines, so nudge a few
      // milliseconds in — still the opening frame, still paused.
      if (video.currentTime === 0) {
        video.currentTime = Math.min(0.05, video.duration / 4);
      }
      setStatus('ready');
      // The section may already be part-way scrolled (reload or deep link):
      // re-run the mapping so the revealed frame matches the scroll offset.
      window.dispatchEvent(new Event('scroll'));
    };

    const fail = () => setStatus('error');
    const stayPaused = () => video.pause();

    if (video.readyState >= 2) reveal();

    video.addEventListener('loadeddata', reveal);
    video.addEventListener('error', fail);
    video.addEventListener('play', stayPaused);

    return () => {
      video.removeEventListener('loadeddata', reveal);
      video.removeEventListener('error', fail);
      video.removeEventListener('play', stayPaused);
    };
  }, []);

  // Scroll → timeline mapping.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!section || !stage || !video) return undefined;

    let top = 0; // scroll offset where the section starts
    let travel = 1; // scrollable distance while the stage is pinned
    let target = 0; // progress implied by the scroll position
    let current = 0; // smoothed progress actually rendered
    let written = -1; // last timeline value handed to the decoder
    let frame = 0;
    let running = false;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      top = rect.top + window.scrollY;
      travel = Math.max(section.offsetHeight - stage.offsetHeight, 1);
    };

    const paint = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        const time = Math.min(current * duration, Math.max(duration - 0.001, 0));
        const forced = current === 0 || current === 1;
        if (forced || Math.abs(time - written) > MIN_SEEK_STEP) {
          video.currentTime = time;
          written = time;
        }
      }

      const copy = copyRef.current;
      if (copy) {
        const fade =
          current <= TEXT_FADE_START
            ? 1
            : Math.max(0, 1 - (current - TEXT_FADE_START) / (TEXT_FADE_END - TEXT_FADE_START));
        copy.style.opacity = String(fade);
        copy.style.transform = `translate3d(0, ${((1 - fade) * -20).toFixed(1)}px, 0)`;
      }

      const veil = veilRef.current;
      if (veil) {
        veil.style.opacity = String(
          Math.max(0, Math.min(1, (current - VEIL_START) / (1 - VEIL_START))),
        );
      }
    };

    const tick = () => {
      const delta = target - current;
      current += delta * SMOOTHING;
      if (Math.abs(delta) < 0.0012) current = target;
      paint();
      if (Math.abs(target - current) > 0.0006) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const readScroll = () => {
      target = Math.min(1, Math.max(0, (window.scrollY - top) / travel));
      start();
    };

    const remeasure = () => {
      measure();
      readScroll();
      current = target; // resizing must not animate the scene
      paint();
    };

    measure();
    readScroll();
    current = target; // first paint lands on the frame for this scroll offset
    paint();

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    window.addEventListener('orientationchange', remeasure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home-hero"
      data-hero="video"
      className="relative isolate bg-navy"
      style={{ height: SECTION_HEIGHT }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden"
      >
        {/* Opening frame: also the fallback if the film cannot be decoded. */}
        <img
          src="/images/hero-video-poster.jpg"
          alt="Modern luxury villa with an illuminated infinity pool at dusk"
          {...{ fetchpriority: 'high' }}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <video
          ref={videoRef}
          poster="/images/hero-video-poster.jpg"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className={classNames(
            'pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-premium',
            status === 'ready' ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* H.264 first: hardware decoding keeps scrubbing far smoother than
              software VP9. WebM is only the fallback for builds without H.264. */}
          <source src={filmSrc} type="video/mp4" />
          <source src="/videos/hero-scrub.webm" type="video/webm" />
        </video>

        {/* Light scrim: enough contrast for the copy, the film stays dominant. */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy/65 via-navy/20 to-navy/55"
          aria-hidden="true"
        />

        <HeroCopy
          innerRef={copyRef}
          className="shell relative z-10 -mt-6 flex w-full flex-col items-center text-center sm:-mt-10"
        />

        {/* Seamless hand-off to the white section below, faded in at the end. */}
        <div
          ref={veilRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white opacity-0"
        />

        {/* Minimal preparation cue — a hairline, no spinner. */}
        <div
          aria-hidden="true"
          className={classNames(
            'pointer-events-none absolute inset-x-0 bottom-8 flex justify-center transition-opacity duration-500',
            status === 'loading' ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="block h-px w-24 overflow-hidden bg-white/20">
            <span className="block h-px w-1/3 animate-pulse bg-champagne" />
          </span>
        </div>
      </div>
    </section>
  );
}
