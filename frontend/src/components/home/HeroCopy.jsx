/**
 * Headline block shared by the scroll-driven hero and its reduced-motion twin.
 *
 * `innerRef` hands the element to the scroll choreography, which fades it out
 * by writing styles directly — no React state, so scrolling never re-renders.
 */
export default function HeroCopy({ className = '', innerRef }) {
  return (
    <div ref={innerRef} className={className}>
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
  );
}
