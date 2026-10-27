import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import FilterBar from '../components/property/FilterBar.jsx';
import PropertyGrid from '../components/property/PropertyGrid.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { useAsyncData, useDebouncedValue } from '../hooks/useAsyncData.js';
import { getFacets, getProperties } from '../lib/api.js';

const PARAM_KEYS = ['q', 'location', 'type', 'minPrice', 'maxPrice', 'beds', 'baths', 'sort', 'featured'];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () =>
      PARAM_KEYS.reduce((accumulator, key) => {
        accumulator[key] = searchParams.get(key) || (key === 'sort' ? 'featured' : '');
        return accumulator;
      }, {}),
    [searchParams],
  );

  const debouncedQuery = useDebouncedValue(filters.q, 350);

  const query = useMemo(
    () => ({
      q: debouncedQuery,
      location: filters.location,
      type: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      beds: filters.beds,
      baths: filters.baths,
      sort: filters.sort,
      featured: filters.featured === 'true' ? 'true' : '',
      limit: 48,
    }),
    [debouncedQuery, filters],
  );

  const { data, loading, error, retry } = useAsyncData(
    () => getProperties(query),
    [JSON.stringify(query)],
  );

  const { data: facetsData } = useAsyncData(() => getFacets(), []);

  const updateFilters = useCallback(
    (patch) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(patch).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
          });
          if (!next.get('sort')) next.delete('sort');
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
  }, [setSearchParams]);

  const properties = data?.items || [];
  const total = data?.total ?? properties.length;

  return (
    <>
      <PageHeader
        label="Portfolio"
        title="Properties"
        description="Every home we currently represent. Filter by location, price and specification — or tell us what you are looking for and we will search off-market on your behalf."
      />

      <div className="bg-white pb-20 pt-10 lg:pb-28 lg:pt-14">
        <div className="shell">
          <Reveal>
            <FilterBar
              facets={facetsData}
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              total={total}
              loading={loading}
            />
          </Reveal>

          <div className="mt-10 lg:mt-14">
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onRetry={retry}
              priorityCount={2}
              emptyAction={
                <Button variant="outline" icon="arrowRight" className="mt-6" onClick={resetFilters}>
                  Clear all filters
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
