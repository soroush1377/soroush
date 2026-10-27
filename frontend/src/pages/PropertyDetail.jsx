import { Link, useParams } from 'react-router-dom';

import InquiryForm from '../components/inquiry/InquiryForm.jsx';
import ViewingModal from '../components/inquiry/ViewingModal.jsx';
import PropertyGallery from '../components/property/PropertyGallery.jsx';
import PropertyGrid from '../components/property/PropertyGrid.jsx';
import PropertyStats from '../components/property/PropertyStats.jsx';
import Button, { CircleButton } from '../components/ui/Button.jsx';
import FavoriteButton from '../components/ui/FavoriteButton.jsx';
import Icon from '../components/ui/Icon.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { COMPANY } from '../lib/content.js';
import { formatBaths, formatDate, formatSqft } from '../lib/format.js';
import { getProperty, getSimilarProperties } from '../lib/api.js';
import { useAsyncData } from '../hooks/useAsyncData.js';

function DetailSkeleton() {
  return (
    <div className="shell py-12" aria-hidden="true">
      <div className="h-3 w-56 animate-pulse rounded bg-navy/10" />
      <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-navy/10" />
      <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-navy/5" />
      <div className="mt-10 grid gap-3 lg:grid-cols-12">
        <div className="aspect-[16/11] animate-pulse rounded-image bg-navy/5 lg:col-span-8" />
        <div className="hidden grid-rows-2 gap-3 lg:col-span-4 lg:grid">
          <div className="animate-pulse rounded-image bg-navy/5" />
          <div className="animate-pulse rounded-image bg-navy/5" />
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { slug } = useParams();
  const { data, loading, error, retry } = useAsyncData(() => getProperty(slug), [slug]);
  const { data: similarData } = useAsyncData(() => getSimilarProperties(slug, 3), [slug]);

  const property = data?.property;
  const similar = similarData?.items || [];

  if (loading) return <DetailSkeleton />;

  if (error) {
    const notFound = error.status === 404;
    return (
      <div className="shell py-24 text-center lg:py-32">
        <p className="section-label">{notFound ? 'Not found' : 'Unavailable'}</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-display-lg">
          {notFound ? 'This property is no longer listed' : 'We could not load this property'}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-body-lg text-ink-soft">
          {notFound
            ? 'It may have been sold or withdrawn. Browse the current portfolio, or let an advisor know what you are looking for.'
            : 'The listing service did not respond. Please try again in a moment.'}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/properties" icon="arrowRight">
            Browse properties
          </Button>
          {!notFound ? (
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  if (!property) return null;

  const agent = property.agent;
  const details = [
    ['Property type', property.type],
    ['Status', property.status],
    ['Bedrooms', property.beds],
    ['Bathrooms', formatBaths(property.baths)],
    ['Interior', formatSqft(property.sqft)],
    ['Lot size', property.lotSize],
    ['Year built', property.yearBuilt],
    ['Parking', `${property.parking} cars`],
  ];

  return (
    <article className="bg-white pb-28 pt-8 lg:pb-24 lg:pt-12">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.8rem] text-ink-faint">
          <Link to="/" className="transition-colors duration-200 hover:text-navy">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/properties" className="transition-colors duration-200 hover:text-navy">
            Properties
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-navy/70">{property.name}</span>
        </nav>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-ui bg-navy px-3 py-1.5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">
                {property.status}
              </span>
              <span className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-champagne-deep">
                {property.type}
              </span>
            </div>

            <h1 className="mt-5 text-display-lg">{property.name}</h1>

            <p className="mt-4 inline-flex items-center gap-2 text-[0.95rem] text-ink-soft">
              <Icon name="mapPin" size={18} className="text-champagne-deep" />
              {property.address}
            </p>

            <PropertyStats property={property} className="mt-5 gap-x-6 text-[0.9rem]" />
          </div>

          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="font-display text-[2rem] font-bold leading-none text-navy lg:text-[2.4rem]">
              {property.priceLabel}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <FavoriteButton property={property} variant="plain" />
              <Button href="#enquire" icon="arrowRight" className="hidden sm:inline-flex">
                Contact agent
              </Button>
              <ViewingModal property={property} variant="outline" />
            </div>
          </div>
        </div>

        <div className="mt-9 lg:mt-11">
          <PropertyGallery images={property.images} propertyName={property.name} />
        </div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 xl:col-span-8">
            <section aria-labelledby="about-this-home">
              <h2 id="about-this-home" className="text-display-md">
                About this home
              </h2>
              {(property.description || []).map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-5 text-body-lg text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="mt-12 lg:mt-14" aria-labelledby="details-heading">
              <h2 id="details-heading" className="text-display-sm">
                Property details
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-navy/10 bg-navy/10 sm:grid-cols-4">
                {details.map(([label, value]) => (
                  <div key={label} className="bg-white px-5 py-6">
                    <dt className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      {label}
                    </dt>
                    <dd className="mt-2 font-display text-[0.98rem] font-semibold text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-12 lg:mt-14" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-display-sm">
                Key features
              </h2>
              <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                {(property.features || []).map((feature) => (
                  <li key={feature} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-soft">
                    <Icon name="check" size={18} className="mt-0.5 text-champagne-deep" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 lg:mt-14" aria-labelledby="amenities-heading">
              <h2 id="amenities-heading" className="text-display-sm">
                Amenities
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {(property.amenities || []).map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-pill border border-navy/12 bg-mist px-4 py-2 text-[0.85rem] text-ink-soft"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12 lg:mt-14" aria-labelledby="location-heading">
              <h2 id="location-heading" className="text-display-sm">
                Location
              </h2>
              <div className="mt-6 rounded-panel border border-navy/10 bg-mist p-6 sm:p-8">
                <p className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-champagne-deep">
                  Address
                </p>
                <p className="mt-3 font-display text-[1.1rem] font-bold text-navy">{property.address}</p>
                <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
                  {property.city}, {property.state} — {property.type.toLowerCase()} listings here are
                  typically held long term, which keeps the neighbourhood quiet and the resale market
                  tight. Ask your advisor for the local comparables behind this valuation.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-navy/10 pt-5 text-[0.85rem] text-ink-soft">
                  <span className="inline-flex items-center gap-2">
                    <Icon name="calendar" size={17} className="text-champagne-deep" />
                    Listed {formatDate(property.listedOn)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Icon name="building" size={17} className="text-champagne-deep" />
                    Reference {property.slug.toUpperCase().slice(0, 12)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[104px]">
              {agent ? (
                <div className="rounded-panel border border-navy/10 bg-white p-6 shadow-card">
                  <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-champagne-deep">
                    Listing advisor
                  </p>
                  <div className="mt-5 flex items-center gap-4">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      loading="lazy"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-display text-[1.05rem] font-bold text-navy">{agent.name}</p>
                      <p className="mt-1 text-[0.82rem] text-ink-soft">{agent.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-[0.9rem] leading-relaxed text-ink-soft">{agent.bio}</p>

                  <div className="mt-5 space-y-2.5 border-t border-navy/10 pt-5">
                    <a
                      href={`tel:${agent.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-3 text-[0.9rem] font-medium text-navy transition-colors duration-200 hover:text-champagne-deep"
                    >
                      <Icon name="phone" size={17} className="text-champagne-deep" />
                      {agent.phone}
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 break-all text-[0.9rem] font-medium text-navy transition-colors duration-200 hover:text-champagne-deep"
                    >
                      <Icon name="mail" size={17} className="text-champagne-deep" />
                      {agent.email}
                    </a>
                  </div>

                  <ViewingModal property={property} variant="primary" full label="Schedule a Viewing" />
                </div>
              ) : null}

              <div id="enquire" className="scroll-mt-[104px] rounded-panel border border-navy/10 bg-white p-6 shadow-card sm:p-7">
                <h2 className="font-display text-[1.2rem] font-bold text-navy">Enquire about this home</h2>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                  Send a message and {agent ? agent.name.split(' ')[0] : 'an advisor'} will reply within one
                  business day — or call {COMPANY.phone} to speak now.
                </p>
                <div className="mt-6">
                  <InquiryForm
                    kind="contact"
                    propertySlug={property.slug}
                    propertyName={property.name}
                    agentName={agent?.name}
                    submitLabel="Request details"
                    idPrefix="property"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 ? (
          <section className="mt-16 border-t border-navy/10 pt-14 lg:mt-24 lg:pt-20" aria-labelledby="similar-heading">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                label="Nearby & similar"
                title="Similar Properties"
                titleClassName="text-display-md"
              />
              <Button to="/properties" variant="outline" size="sm" icon="arrowRight">
                All properties
              </Button>
            </div>
            <div className="mt-10">
              <PropertyGrid properties={similar} columnsClassName="sm:grid-cols-2 lg:grid-cols-3" />
            </div>
          </section>
        ) : null}
      </div>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <FavoriteButton property={property} variant="plain" />
          <Button href="#enquire" variant="outline" size="sm" className="flex-1">
            Enquire
          </Button>
          <ViewingModal property={property} variant="primary" size="sm" label="Viewing" />
        </div>
      </div>
    </article>
  );
}
