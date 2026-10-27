import { classNames } from '../../lib/format.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

/** Closing call to action band — light blue-grey panel, navy key mark, one CTA. */
export default function CtaSection({ className, title, description, buttonLabel = 'Get in Touch', to = '/contact' }) {
  return (
    <section className={classNames('bg-white pb-20 lg:pb-28', className)}>
      <div className="shell">
        <div className="flex flex-col items-start gap-8 rounded-panel bg-mist p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:p-12">
          <div className="flex items-start gap-6">
            <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-champagne">
              <Icon name="key" size={26} />
            </span>
            <div>
              <h2 className="max-w-xl text-display-md text-navy">
                {title || 'Ready to Find Your Perfect Property?'}
              </h2>
              <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-ink-soft">
                {description || 'Let our experts guide you to the right home or investment.'}
              </p>
            </div>
          </div>

          <Button to={to} icon="arrowRight" size="lg" className="shrink-0">
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
