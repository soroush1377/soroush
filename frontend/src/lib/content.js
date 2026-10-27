// Editable site content: navigation, marketing copy and contact details.

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
];

export const COMPANY = {
  name: 'Horizon Properties',
  tagline: 'Exceptional homes & investments',
  phone: '(555) 246-7890',
  phoneHref: 'tel:+15552467890',
  email: 'hello@horizonproperties.com',
  address: ['1200 Congress Avenue, Suite 1800', 'Austin, Texas 78701'],
  hours: 'Monday – Friday, 9am – 6pm',
  founded: 2004,
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
};

export const ABOUT_COPY = {
  label: 'About Us',
  heading: 'Who We Are',
  body: 'At Horizon Properties, we connect people with extraordinary homes and smart investments. Integrity, transparency, and client satisfaction are at the heart of everything we do.',
  secondary:
    'From first valuation to final signature, one senior advisor stays with you — so every decision is informed, unhurried and made with your long-term interest in mind.',
  slides: [
    {
      src: '/images/about-main.jpg',
      alt: 'Contemporary villa with a swimming pool and landscaped grounds in daylight',
    },
    {
      src: '/images/about-side.jpg',
      alt: 'Geometric concrete house facade seen through garden planting',
    },
    {
      src: '/images/service-3.jpg',
      alt: 'Modern residence with stone and timber cladding approached through mature planting',
    },
  ],
};

export const ABOUT_PRINCIPLES = [
  {
    title: 'Advice before inventory',
    body: 'We would rather tell you a property is wrong for you than sell it to you. That single habit is why most of our business now arrives by referral.',
  },
  {
    title: 'Design-literate representation',
    body: 'Architecture, provenance and materials change what a home is worth. We read them the way an architect does, and price them accordingly.',
  },
  {
    title: 'Discretion as standard',
    body: 'A significant share of our transactions never reach the open market. If privacy matters to you, it shapes how we work from day one.',
  },
];

export const SERVICES = [
  {
    slug: 'luxury-home-sales',
    title: 'Luxury Home Sales',
    summary:
      'Representing architecturally significant homes with discretion, precise pricing and an audience of qualified buyers.',
    detail:
      'We take a small number of listings each year so every property gets senior attention: bespoke photography, staged presentation, private viewings by appointment and a negotiation strategy built around your timeline.',
    image: '/images/service-1.jpg',
    imageAlt: 'Modern home with timber and stone facade lit in the evening',
    points: ['Senior advisor on every listing', 'Bespoke photography and staging', 'Private, appointment-only viewings'],
  },
  {
    slug: 'property-investment',
    title: 'Property Investment',
    summary:
      'Acquisitions for private clients and family offices, underwritten on yield, hold period and exit value.',
    detail:
      'We model each opportunity against real comparables and running costs, then advise on structure, financing and timing — and stay involved through the hold period.',
    image: '/images/service-2.jpg',
    imageAlt: 'Luxury resort-style residence with pool and terraces at dusk',
    points: ['Yield and exit modelling', 'Off-market acquisition', 'Portfolio reviews every quarter'],
  },
  {
    slug: 'property-marketing',
    title: 'Property Marketing',
    summary:
      'Editorial-grade campaigns that place architectural homes in front of the right audience.',
    detail:
      'Architectural photography, film, print and targeted digital reach — planned as one campaign so the property is introduced once, and introduced properly.',
    image: '/images/service-3.jpg',
    imageAlt: 'Modern residence with stone and timber cladding in a landscaped setting',
    points: ['Architectural photography and film', 'Print and digital campaigns', 'Performance reporting'],
  },
  {
    slug: 'real-estate-advisory',
    title: 'Real Estate Advisory',
    summary:
      'Independent advice on portfolio structure, timing and the market you are actually buying into.',
    detail:
      'Whether you are consolidating, diversifying or preparing to sell, we provide straight answers on value, liquidity and risk — with the data behind them.',
    image: '/images/service-4.jpg',
    imageAlt: 'Contemporary house with large glazing and a terrace',
    points: ['Portfolio and risk review', 'Market and comparables analysis', 'Independent, fee-based advice'],
  },
  {
    slug: 'property-valuation',
    title: 'Property Valuation',
    summary:
      'Detailed valuations grounded in comparable sales, condition and design provenance.',
    detail:
      'A written valuation with the comparable evidence attached, suitable for sale preparation, refinancing, insurance or estate planning.',
    image: '/images/about-main.jpg',
    imageAlt: 'Contemporary villa with pool and landscaped grounds',
    points: ['Written valuation report', 'Comparable sales evidence', 'Refinance and insurance ready'],
  },
  {
    slug: 'relocation-services',
    title: 'Relocation Services',
    summary:
      'End-to-end relocation for families and executives moving into a new market.',
    detail:
      'Neighbourhood shortlists, school and club introductions, temporary accommodation and a single point of contact from first call to keys in hand.',
    image: '/images/service-2.jpg',
    imageAlt: 'Poolside terrace with loungers facing open views',
    points: ['Neighbourhood shortlisting', 'School and club introductions', 'Single point of contact'],
  },
];

export const WHY_CHOOSE = {
  label: 'Why Horizon',
  heading: 'Why Choose Horizon',
  intro:
    'Two decades of representing fine homes has taught us that the details decide the outcome — how a property is presented, how a negotiation is conducted, and how calmly it is all handled.',
  reasons: [
    {
      title: 'Senior advisors, start to finish',
      body: 'One experienced advisor owns your file from valuation to closing. No handoffs, no call centre.',
    },
    {
      title: 'A qualified private network',
      body: 'A significant share of our homes change hands before they reach the open market.',
    },
    {
      title: 'Design-literate representation',
      body: 'We understand architecture, provenance and materials — and price accordingly.',
    },
    {
      title: 'Transparent, written advice',
      body: 'Every recommendation arrives with its comparable evidence and its risks attached.',
    },
  ],
  stats: [
    { value: '$1.4B', label: 'Property represented' },
    { value: '20+', label: 'Years in prime markets' },
    { value: '98%', label: 'Client satisfaction' },
    { value: '34', label: 'Days average to offer' },
  ],
};

export const PRICE_FILTERS = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Up to $2M', min: '', max: '2000000' },
  { label: '$2M – $3M', min: '2000000', max: '3000000' },
  { label: '$3M – $5M', min: '3000000', max: '5000000' },
  { label: '$5M – $7M', min: '5000000', max: '7000000' },
  { label: '$7M+', min: '7000000', max: '' },
];

export const SORT_OPTIONS = [
  { label: 'Featured first', value: 'featured' },
  { label: 'Newest listings', value: 'newest' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Most bedrooms', value: 'beds-desc' },
  { label: 'Largest floor area', value: 'sqft-desc' },
];

export const BEDS_OPTIONS = [
  { label: 'Any beds', value: '' },
  { label: '3+ bedrooms', value: '3' },
  { label: '4+ bedrooms', value: '4' },
  { label: '5+ bedrooms', value: '5' },
  { label: '6+ bedrooms', value: '6' },
];

export const BATHS_OPTIONS = [
  { label: 'Any baths', value: '' },
  { label: '2+ bathrooms', value: '2' },
  { label: '3+ bathrooms', value: '3' },
  { label: '4+ bathrooms', value: '4' },
  { label: '5+ bathrooms', value: '5' },
];

export const VIEWING_TIMES = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
