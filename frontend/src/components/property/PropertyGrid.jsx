import { classNames } from '../../lib/format.js';
import Button from '../ui/Button.jsx';
import PropertyCard from './PropertyCard.jsx';

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-image border border-navy/10 bg-white">
      <div className="aspect-[4/3] w-full animate-pulse bg-navy/5" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-2/3 animate-pulse rounded bg-navy/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-navy/10" />
        <div className="h-3 w-full animate-pulse rounded bg-navy/5" />
        <div className="h-px w-full bg-navy/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-navy/10" />
      </div>
    </div>
  );
}

/** Responsive grid of property cards with loading and empty states. */
export default function PropertyGrid({
  properties = [],
  loading = false,
  error = null,
  onRetry,
  emptyAction = null,
  columnsClassName = 'sm:grid-cols-2 lg:grid-cols-3',
  priorityCount = 0,
}) {
  if (loading) {
    return (
      <div className={classNames('grid grid-cols-1 gap-6 lg:gap-7', columnsClassName)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-image border border-navy/10 bg-mist px-6 py-16 text-center">
        <h3 className="font-display text-display-sm">We could not load these properties</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-ink-soft">
          The listing service did not respond. Please try again in a moment.
        </p>
        {onRetry ? (
          <Button onClick={onRetry} icon="arrowRight" className="mt-6">
            Try again
          </Button>
        ) : null}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-image border border-navy/10 bg-mist px-6 py-16 text-center">
        <h3 className="font-display text-display-sm">No properties match your search</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-ink-soft">
          Try widening the price range or clearing a filter — our advisors can also search
          off-market on your behalf.
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className={classNames('grid grid-cols-1 gap-6 lg:gap-7', columnsClassName)}>
      {properties.map((property, index) => (
        <PropertyCard key={property.slug} property={property} priority={index < priorityCount} />
      ))}
    </div>
  );
}

export { CardSkeleton };
