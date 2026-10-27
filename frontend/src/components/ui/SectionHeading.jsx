import { classNames } from '../../lib/format.js';

/**
 * Label + display title + optional supporting copy. `tone="light"` is for navy
 * sections; the champagne micro-rule is the repeating structural motif.
 */
export default function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  tone = 'dark',
  as: Tag = 'h2',
  className,
  titleClassName,
  children,
}) {
  const centered = align === 'center';

  return (
    <div className={classNames(centered && 'flex flex-col items-center text-center', className)}>
      {label ? (
        <div className={classNames('eyebrow-divider', centered && 'justify-center')}>
          <span className={classNames('h-px w-8', tone === 'light' ? 'bg-champagne-soft/70' : 'bg-champagne')} />
          <span className={classNames('section-label', tone === 'light' && 'text-champagne-soft')}>
            {label}
          </span>
        </div>
      ) : null}

      <Tag
        className={classNames(
          'mt-4 text-balance text-display-lg',
          tone === 'light' ? 'text-white' : 'text-navy',
          centered && 'mx-auto max-w-3xl',
          label ? '' : 'mt-0',
          titleClassName,
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={classNames(
            'mt-5 max-w-2xl text-body-lg',
            tone === 'light' ? 'text-white/70' : 'text-ink-soft',
            centered && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}
