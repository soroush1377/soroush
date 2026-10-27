import { WHY_CHOOSE } from '../../lib/content.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';

/** Navy credibility section: reasons on the left, headline numbers on the right. */
export default function WhyChooseSection() {
  return (
    <section className="bg-navy py-20 text-white/70 lg:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <SectionHeading
            tone="light"
            label={WHY_CHOOSE.label}
            title={WHY_CHOOSE.heading}
            description={WHY_CHOOSE.intro}
          />

          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {WHY_CHOOSE.reasons.map((reason) => (
              <li key={reason.title}>
                <span className="micro-rule block" />
                <h3 className="mt-5 font-display text-[1.05rem] font-bold text-white">{reason.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-white/60">{reason.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={120}>
          <div className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-panel border border-white/12 bg-white/10">
            {WHY_CHOOSE.stats.map((stat) => (
              <div key={stat.label} className="bg-navy px-6 py-8 lg:px-7 lg:py-10">
                <p className="font-display text-[2rem] font-bold leading-none text-white lg:text-[2.35rem]">
                  {stat.value}
                </p>
                <p className="mt-3 font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-champagne">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
