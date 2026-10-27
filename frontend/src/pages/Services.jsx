import PageHeader from '../components/layout/PageHeader.jsx';
import CtaSection from '../components/home/CtaSection.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { SERVICES } from '../lib/content.js';

export default function Services() {
  return (
    <>
      <PageHeader
        label="Services"
        title="Services"
        description="Six disciplines, one senior advisor. Everything we do is designed to protect the value of your property and the quality of your decision."
      />

      <div className="bg-white">
        {SERVICES.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-[100px] border-b border-navy/10 py-16 lg:py-20"
          >
            <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal
                className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                delay={60}
              >
                <figure className="group overflow-hidden rounded-image bg-navy/5">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03]"
                  />
                </figure>
              </Reveal>

              <Reveal
                className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                delay={120}
              >
                <p className="font-display text-[0.75rem] font-semibold tracking-[0.2em] text-champagne-deep">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-4 text-display-md">{service.title}</h2>
                <p className="mt-5 max-w-2xl text-body-lg text-ink-soft">{service.summary}</p>
                <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft/90">
                  {service.detail}
                </p>

                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.92rem] text-ink-soft">
                      <Icon name="check" size={18} className="mt-0.5 text-champagne-deep" />
                      {point}
                    </li>
                  ))}
                </ul>

                <Button to="/contact" variant="outline" icon="arrowRight" className="mt-9">
                  Discuss this service
                </Button>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <CtaSection
        title="Not sure where to start?"
        description="Tell us what you are trying to achieve and we will tell you which of these services you actually need."
        buttonLabel="Talk to an advisor"
      />
    </>
  );
}
