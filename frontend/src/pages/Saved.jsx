import { useMemo } from 'react';

import PageHeader from '../components/layout/PageHeader.jsx';
import PropertyGrid from '../components/property/PropertyGrid.jsx';
import Button from '../components/ui/Button.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { getProperties } from '../lib/api.js';

export default function Saved() {
  const { favorites, clear } = useFavorites();
  const { data, loading, error, retry } = useAsyncData(() => getProperties({ limit: 48 }), []);

  const savedProperties = useMemo(() => {
    const items = data?.items || [];
    return favorites
      .map((slug) => items.find((property) => property.slug === slug))
      .filter(Boolean);
  }, [data, favorites]);

  const missingCount = favorites.length - savedProperties.length;

  return (
    <>
      <PageHeader
        label="Your Selection"
        title="Saved Properties"
        description="Homes you have shortlisted are kept on this device, so you can return to them at any time."
      />

      <div className="bg-white pb-20 pt-10 lg:pb-28 lg:pt-14">
        <div className="shell">
          {favorites.length === 0 ? (
            <div className="rounded-panel border border-navy/10 bg-mist px-6 py-16 text-center lg:py-20">
              <h2 className="font-display text-display-sm">Nothing saved yet</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                Use the heart on any property to keep it here. Your shortlist makes it easy to compare
                homes side by side before you speak with an advisor.
              </p>
              <Button to="/properties" icon="arrowRight" className="mt-7">
                Browse properties
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[0.92rem] text-ink-soft">
                  {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
                  {missingCount > 0 ? ' · some are no longer listed' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clear} className="px-2">
                  Clear all
                </Button>
              </div>

              <PropertyGrid
                properties={savedProperties}
                loading={loading}
                error={error}
                onRetry={retry}
                priorityCount={2}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
