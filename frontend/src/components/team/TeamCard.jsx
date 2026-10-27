import { classNames } from '../../lib/format.js';
import Icon from '../ui/Icon.jsx';

/**
 * Team member card: portrait with a restrained colour reveal on hover, plus
 * direct phone and email links.
 */
export default function TeamCard({ agent, className }) {
  return (
    <article className={classNames('group', className)}>
      <div className="relative overflow-hidden rounded-image bg-navy/5">
        <img
          src={agent.photo}
          alt={`${agent.name}, ${agent.role} at Horizon Properties`}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full object-cover grayscale transition-all duration-[900ms] ease-premium group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/55 to-transparent opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100" />
      </div>

      <div className="mt-5">
        <h3 className="font-display text-[1.15rem] font-bold text-navy">{agent.name}</h3>
        <p className="mt-1.5 font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-champagne-deep">
          {agent.role}
        </p>
        <p className="mt-4 line-clamp-3 text-[0.9rem] leading-relaxed text-ink-soft">{agent.bio}</p>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
            aria-label={`Call ${agent.name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 ease-premium hover:border-navy hover:bg-navy hover:text-white"
          >
            <Icon name="phone" size={17} />
          </a>
          <a
            href={`mailto:${agent.email}`}
            aria-label={`Email ${agent.name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 ease-premium hover:border-navy hover:bg-navy hover:text-white"
          >
            <Icon name="mail" size={17} />
          </a>
          <span className="ml-1 text-[0.82rem] text-ink-faint">{agent.phone}</span>
        </div>
      </div>
    </article>
  );
}
