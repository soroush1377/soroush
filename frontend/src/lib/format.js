// Presentation helpers — kept free of React so they can be reused anywhere.

export const formatPrice = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2)} Million`;
  }
  return `$${value.toLocaleString('en-US')}`;
};

export const formatPriceCompact = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
};

export const formatBaths = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '—';
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
};

export const formatSqft = (value) =>
  typeof value === 'number' ? `${value.toLocaleString('en-US')} sq ft` : '—';

export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const classNames = (...values) => values.filter(Boolean).join(' ');
