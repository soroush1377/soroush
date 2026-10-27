import { classNames } from '../../lib/format.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

/** Consistent page opener used by every interior page. */
export default function PageHeader({ label, title, description, children, tone = 'mist', align = 'left' }) {
  return (
    <section className={classNames('border-b border-navy/[0.07]', tone === 'mist' ? 'bg-mist' : 'bg-white')}>
      <div className="shell py-14 lg:py-20">
        <Reveal>
          <SectionHeading
            label={label}
            title={title}
            description={description}
            as="h1"
            align={align}
            titleClassName="text-display-xl"
          />
          {children}
        </Reveal>
      </div>
    </section>
  );
}
