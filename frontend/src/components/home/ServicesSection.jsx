import { Link } from 'react-router-dom';

import { SERVICES } from '../../lib/content.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

/**
 * Editorial services list — numbered rows on hairlines rather than icon boxes.
 */
export default function ServicesSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            label="Services"
            title="How We Work With You"
            description="Six disciplines, one senior advisor and a process built around your decision — not our listing volume."
          />
          <Button to="/services" variant="outline" icon="arrowRight" className="mt-9">
            Explore services
          </Button>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={120}>
          <ul className="border-t border-navy/10">
            {SERVICES.map((service, index) => (
              <li key={service.slug} className="border-b border-navy/10">
                <Link
                  to={`/services#${service.slug}`}
                  className="group flex items-start gap-6 py-7 transition-colors duration-300 ease-premium hover:bg-mist/70 lg:gap-8 lg:py-8"
                >
                  <span className="mt-1 font-display text-[0.78rem] font-semibold tracking-[0.18em] text-champagne-deep">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">
                    <span className="font-display text-[1.15rem] font-bold text-navy lg:text-[1.3rem]">
                      {service.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                      {service.summary}
                    </span>
                  </span>
                  <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-300 ease-premium group-hover:border-navy group-hover:bg-navy group-hover:text-white">
                    <Icon name="arrowRight" size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
