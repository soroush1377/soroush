import { classNames, formatBaths } from '../../lib/format.js';
import Icon from '../ui/Icon.jsx';

/**
 * Bed / bath / floor-area row shared by cards and the property detail header.
 */
export default function PropertyStats({ property, className, tone = 'dark', showType = false }) {
  const items = [
    { icon: 'bed', label: `${property.beds} bed${property.beds === 1 ? '' : 's'}` },
    { icon: 'bath', label: `${formatBaths(property.baths)} bath${Number(property.baths) === 1 ? '' : 's'}` },
    { icon: 'area', label: `${property.sqft.toLocaleString('en-US')} sq ft` },
  ];

  if (showType) items.push({ icon: 'building', label: property.type });

  return (
    <ul
      className={classNames(
        'flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem]',
        tone === 'light' ? 'text-white/75' : 'text-ink-soft',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-2">
          <Icon name={item.icon} size={17} className={tone === 'light' ? 'text-white/60' : 'text-champagne-deep'} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
