/**
 * Full-bleed architectural hero: the headline and supporting line sit in the
 * upper-middle of a cinematic villa image, with a calm entrance animation and a
 * gradient that settles into the white section below.
 */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-navy pt-[68px] lg:h-[calc(100svh-0px)] lg:max-h-[940px] lg:min-h-[700px] lg:pt-[76px]">
      <img
        src="/images/hero.jpg"
        alt="Modern luxury villa with an illuminated infinity pool at dusk"
        {...{ fetchpriority: 'high' }}
        decoding="async"
        className="absolute inset-0 h-full w-full animate-image-in object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/88 via-navy/45 to-navy/80" aria-hidden="true" />

      <div className="shell relative z-10 -mt-6 flex w-full flex-col items-center text-center sm:-mt-10">
        <h1 className="max-w-4xl animate-fade-up text-balance text-display-xl text-white">
          Discover Exceptional
          <br className="hidden sm:block" /> Homes &amp; Investments
        </h1>

        <p
          className="mt-6 max-w-2xl animate-fade-up text-[1rem] leading-relaxed text-white/80 sm:text-[1.06rem]"
          style={{ animationDelay: '120ms' }}
        >
          Premium properties in prime locations. Find your dream home or the perfect investment with
          confidence.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}
