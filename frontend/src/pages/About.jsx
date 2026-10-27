import PageHeader from '../components/layout/PageHeader.jsx';
import CtaSection from '../components/home/CtaSection.jsx';
import TeamSection from '../components/home/TeamSection.jsx';
import WhyChooseSection from '../components/home/WhyChooseSection.jsx';
import { AboutImagePair } from '../components/home/AboutSection.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { ABOUT_COPY, ABOUT_PRINCIPLES } from '../lib/content.js';

export default function About() {
  return (
    <>
      <PageHeader label="About Us" title="Who We Are" description={ABOUT_COPY.body} />

      <section className="bg-white py-20 lg:py-28">
        <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <ul className="space-y-9">
              {ABOUT_PRINCIPLES.map((principle, index) => (
                <li key={principle.title} className="flex gap-6">
                  <span className="mt-1 font-display text-[0.78rem] font-semibold tracking-[0.18em] text-champagne-deep">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-display text-[1.2rem] font-bold text-navy">{principle.title}</h2>
                    <p className="mt-2.5 max-w-xl text-[0.98rem] leading-relaxed text-ink-soft">{principle.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button to="/properties" icon="arrowRight" className="mt-11">
              Explore the portfolio
            </Button>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={120}>
            <AboutImagePair slides={ABOUT_COPY.slides} />
          </Reveal>
        </div>
      </section>

      <WhyChooseSection />
      <TeamSection />
      <CtaSection />
    </>
  );
}
