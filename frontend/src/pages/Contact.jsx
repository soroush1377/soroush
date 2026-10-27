import InquiryForm from '../components/inquiry/InquiryForm.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Icon from '../components/ui/Icon.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { COMPANY } from '../lib/content.js';

const ICONS = { Instagram: 'instagram', LinkedIn: 'linkedin', Facebook: 'facebook', YouTube: 'youtube' };

export default function Contact() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Get in Touch"
        description="Whether you are buying, selling or simply weighing up your options, a short conversation with an advisor is the fastest way forward."
      />

      <div className="bg-white pb-20 pt-14 lg:pb-28 lg:pt-20">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="text-display-md">Our office</h2>
            <p className="mt-4 max-w-md text-body-lg text-ink-soft">
              Appointments are by arrangement, so we can give you undivided attention. Walk-ins are
              welcome but a call ahead always helps.
            </p>

            <ul className="mt-9 space-y-6">
              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon name="phone" size={18} />
                </span>
                <div>
                  <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    Phone
                  </p>
                  <a
                    href={COMPANY.phoneHref}
                    className="mt-1 block font-display text-[1.05rem] font-semibold text-navy transition-colors duration-200 hover:text-champagne-deep"
                  >
                    {COMPANY.phone}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon name="mail" size={18} />
                </span>
                <div>
                  <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    Email
                  </p>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="mt-1 block break-all font-display text-[1.05rem] font-semibold text-navy transition-colors duration-200 hover:text-champagne-deep"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon name="mapPin" size={18} />
                </span>
                <div>
                  <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    Office
                  </p>
                  <address className="mt-1 not-italic text-[0.98rem] leading-relaxed text-ink-soft">
                    {COMPANY.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mist text-navy">
                  <Icon name="clock" size={18} />
                </span>
                <div>
                  <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                    Hours
                  </p>
                  <p className="mt-1 text-[0.98rem] text-ink-soft">{COMPANY.hours}</p>
                  <p className="mt-1 text-[0.9rem] text-ink-faint">
                    Private viewings available evenings and weekends.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-10 flex items-center gap-3">
              {COMPANY.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${COMPANY.name} on ${social.label}`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 ease-premium hover:border-navy hover:bg-navy hover:text-white"
                >
                  <Icon name={ICONS[social.label] || 'arrowRight'} size={18} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={120}>
            <div className="rounded-panel border border-navy/10 bg-white p-6 shadow-card sm:p-8 lg:p-10">
              <h2 className="text-display-sm">Send us a message</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
                Tell us what you are looking for — location, budget and timing help us respond
                properly. Every message is answered by an advisor, not a queue.
              </p>
              <div className="mt-8">
                <InquiryForm kind="general" submitLabel="Send message" idPrefix="contact" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
