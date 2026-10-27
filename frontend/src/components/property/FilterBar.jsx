import { useState } from 'react';

import { BATHS_OPTIONS, BEDS_OPTIONS, PRICE_FILTERS, SORT_OPTIONS } from '../../lib/content.js';
import { classNames, formatPriceCompact } from '../../lib/format.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

const priceKey = (filters) => `${filters.minPrice || ''}:${filters.maxPrice || ''}`;

function Select({ id, label, value, options, onChange, className }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} className="select-field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={`${id}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Search, filter and sort controls for the browse page. Filters live in the URL,
 * so results stay shareable and the back button behaves.
 */
export default function FilterBar({ facets, filters, onChange, onReset, total = 0, loading = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const locationOptions = [
    { value: '', label: 'All locations' },
    ...(facets?.locations || []).map((location) => ({ value: location.city, label: location.label })),
  ];

  const typeOptions = [
    { value: '', label: 'All property types' },
    ...(facets?.types || []).map((type) => ({ value: type, label: type })),
  ];

  const priceOptions = PRICE_FILTERS.map((option) => ({
    value: `${option.min}:${option.max}`,
    label: option.label,
  }));

  const chips = [];
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”` });
  if (filters.location) chips.push({ key: 'location', label: filters.location });
  if (filters.type) chips.push({ key: 'type', label: filters.type });
  if (filters.minPrice || filters.maxPrice) {
    const preset = PRICE_FILTERS.find(
      (option) => option.min === (filters.minPrice || '') && option.max === (filters.maxPrice || ''),
    );
    chips.push({
      key: 'price',
      label:
        preset?.label ||
        `${filters.minPrice ? formatPriceCompact(Number(filters.minPrice)) : 'Any'} – ${
          filters.maxPrice ? formatPriceCompact(Number(filters.maxPrice)) : 'Any'
        }`,
    });
  }
  if (filters.beds) chips.push({ key: 'beds', label: `${filters.beds}+ beds` });
  if (filters.baths) chips.push({ key: 'baths', label: `${filters.baths}+ baths` });
  if (filters.featured === 'true') chips.push({ key: 'featured', label: 'Featured only' });

  const selectFields = (
    <>
      <Select
        id="filter-location"
        label="Location"
        value={filters.location}
        options={locationOptions}
        onChange={(value) => onChange({ location: value })}
        className="sm:col-span-1 lg:col-span-3"
      />
      <Select
        id="filter-type"
        label="Property type"
        value={filters.type}
        options={typeOptions}
        onChange={(value) => onChange({ type: value })}
        className="sm:col-span-1 lg:col-span-2"
      />
      <Select
        id="filter-price"
        label="Price range"
        value={priceKey(filters)}
        options={priceOptions}
        onChange={(value) => {
          const [min, max] = value.split(':');
          onChange({ minPrice: min, maxPrice: max });
        }}
        className="sm:col-span-2 lg:col-span-3"
      />
      <Select
        id="filter-beds"
        label="Bedrooms"
        value={filters.beds}
        options={BEDS_OPTIONS}
        onChange={(value) => onChange({ beds: value })}
        className="sm:col-span-1 lg:col-span-2"
      />
      <Select
        id="filter-baths"
        label="Bathrooms"
        value={filters.baths}
        options={BATHS_OPTIONS}
        onChange={(value) => onChange({ baths: value })}
        className="sm:col-span-1 lg:col-span-2"
      />
    </>
  );

  return (
    <div className="rounded-panel border border-navy/10 bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <div className="flex-1">
          <label htmlFor="filter-search" className="field-label">
            Search
          </label>
          <div className="relative">
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              id="filter-search"
              type="search"
              className="field pl-11"
              placeholder="Search by name, city or keyword"
              value={filters.q}
              onChange={(event) => onChange({ q: event.target.value })}
            />
          </div>
        </div>

        <div className="flex items-end gap-3">
          <Select
            id="filter-sort"
            label="Sort by"
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={(value) => onChange({ sort: value })}
            className="hidden min-w-[190px] lg:block"
          />

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="filter-panel"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-ui border border-navy/20 px-4 font-display text-[0.85rem] font-semibold text-navy transition-colors duration-300 ease-premium hover:border-navy lg:hidden"
          >
            <Icon name="filter" size={18} />
            Filters
            {chips.length > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[0.7rem] text-white">
                {chips.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div
        id="filter-panel"
        className={classNames(
          'mt-4 grid gap-4 border-t border-navy/10 pt-4 sm:grid-cols-2 lg:grid-cols-12',
          mobileOpen ? 'grid' : 'hidden lg:grid',
        )}
      >
        {selectFields}
        <Select
          id="filter-sort-mobile"
          label="Sort by"
          value={filters.sort}
          options={SORT_OPTIONS}
          onChange={(value) => onChange({ sort: value })}
          className="sm:col-span-2 lg:hidden"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={filters.featured === 'true'}
            onClick={() => onChange({ featured: filters.featured === 'true' ? '' : 'true' })}
            className={classNames(
              'inline-flex min-h-[38px] items-center gap-2 rounded-pill border px-3.5 font-display text-[0.76rem] font-semibold transition-all duration-300 ease-premium',
              filters.featured === 'true'
                ? 'border-champagne bg-champagne/15 text-navy'
                : 'border-navy/15 text-ink-soft hover:border-navy/35 hover:text-navy',
            )}
          >
            <Icon name="star" size={15} />
            Featured only
          </button>

          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onChange(chip.key === 'price' ? { minPrice: '', maxPrice: '' } : { [chip.key]: '' })}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-pill border border-navy/15 bg-white px-3.5 font-display text-[0.76rem] font-semibold text-navy transition-colors duration-300 ease-premium hover:border-navy/40"
            >
              {chip.label}
              <Icon name="close" size={13} className="text-ink-faint" />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-[0.85rem] text-ink-soft" aria-live="polite">
            {loading ? 'Searching…' : `${total} ${total === 1 ? 'property' : 'properties'}`}
          </p>
          {chips.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={onReset} className="px-2">
              Reset all
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
