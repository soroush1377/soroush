import { useAsyncData } from '../../hooks/useAsyncData.js';
import { getProperties } from '../../lib/api.js';
import { classNames } from '../../lib/format.js';
import PropertyCarousel from '../property/PropertyCarousel.jsx';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

function CarouselSkeleton() {
  return (
    <div className="no-scrollbar flex gap-5 overflow-hidden px-5 sm:px-8 lg:gap-6 lg:px-10" aria-hidden="true">
      {[520, 330, 330, 330].map((width, index) => (
        <div
          key={width + index}
          style={{ width: `min(${width}px, 80vw)` }}
          className="h-[420px] shrink-0 animate-pulse rounded-image bg-navy/5 sm:h-[470px] lg:h-[540px]"
        />
      ))}
    </div>
  );
}

export default function FeaturedSection() {
  const { data, loading, error, retry } = useAsyncData(
    () => getProperties({ featured: 'true', limit: 8 }),
    [],
  );

  const properties = data?.items || [];

  return (
    <section className="bg-white pb-20 pt-16 lg:pb-24 lg:pt-20">
      <div className="shell">
        <Reveal>
          <SectionHeading
            align="center"
            label="Featured"
            title="Featured Properties"
            description="A short selection from our current portfolio — architectural homes in prime locations, represented with care."
          />
        </Reveal>
      </div>

      <div className={classNames('mt-12 lg:mt-14', error && 'shell')}>
        {loading ? (
          <CarouselSkeleton />
        ) : error ? (
          <div className="rounded-image border border-navy/10 bg-mist px-6 py-14 text-center">
            <h3 className="font-display text-display-sm">Featured listings are unavailable</h3>
            <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-ink-soft">
              We could not reach the listing service. Please try again.
            </p>
            <Button onClick={retry} icon="arrowRight" className="mt-6">
              Try again
            </Button>
          </div>
        ) : (
          <PropertyCarousel properties={properties} ariaLabel="Featured properties" />
        )}
      </div>

      {!error && properties.length > 0 ? (
        <div className="shell mt-10 flex justify-center">
          <Button to="/properties" variant="outline" icon="arrowRight">
            View all properties
          </Button>
        </div>
      ) : null}
    </section>
  );
}
