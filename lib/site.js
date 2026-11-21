import { AREAS } from './areas';

// All association facts shown on the public site live here, so the committee can review them in one place.
// Anything marked TODO is not confirmed by ITCHA yet. Empty lists/nulls hide that block on the site
// instead of showing invented data.

export const site = {
  shortName: 'ITCHA',
  name: 'IT Corridor Hostels Association',
  state: 'Telangana',
  tagline: 'Together for safe, compliant and well-run hostels in the IT corridor.',
  // Silent looping clip in the home hero (replaces the logo card). Set to null to show the logo again.
  // Sample footage for now; swap src/poster for the real latest-meeting video when ITCHA sends it.
  heroVideo: { src: '/media/hero-sample.mp4', poster: '/media/hero-sample.jpg', caption: 'Latest from ITCHA' },
  url: process.env.SITE_URL || 'https://itcha.org',

  // Reg. No. from ITCHA's Central Committee 2026 letterhead. TODO: confirm the Act it is registered under.
  registration: { act: null, number: '478/2020', registeredName: 'Telangana State IT Corridor Hostels Association (TSITCHA)' },

  // TODO: confirm. Shown in header, footer and contact page; hidden while null.
  contact: {
    phone: null, // '+91 9xxxx xxxxx'
    email: null, // 'contact@itcha.org'
    address: null,
    hours: null, // 'Mon-Sat, 10:00 AM - 6:00 PM'
    mapUrl: null,
  },

  social: { instagram: null, facebook: null, youtube: null, whatsapp: null },

  // TODO: confirm. Hidden on the site until filled in.
  stats: [], // e.g. [{ value: '400+', label: 'Hostel owners at our first meet' }]

  // Localities with an ITCHA area committee (fixed list in lib/areas.js).
  areas: AREAS,

  // Central committee office bearers shown on Home/About. Full lists: lib/central-committee.js. Each: { name, role, photo? }
  committee: [
    { name: 'Pasam Amarnath Reddy', role: 'President' },
    { name: 'Tata Karunakar', role: 'General Secretary' },
    { name: 'Kasireddy Nagi Reddy', role: 'Treasurer' },
  ],

  mission:
    'To bring hostel and PG owners of the IT corridor together as one community, so that every member runs a safe, legal and fairly managed hostel, and has a collective voice with local bodies and government departments.',
  vision:
    'A connected, responsible and safety-conscious hostel community where owners can run their business with confidence and residents live in safe, clean and well-managed homes.',

  values: [
    { icon: 'Users', tone: 'teal', title: 'Unity', text: 'One voice for owners on the issues that affect all of us.' },
    { icon: 'ShieldCheck', tone: 'sky', title: 'Safety', text: 'Fire, LPG, food and resident safety come first.' },
    { icon: 'FileCheck2', tone: 'gold', title: 'Compliance', text: 'Help every member hold the right licences and follow the process.' },
    { icon: 'Eye', tone: 'mint', title: 'Transparency', text: 'Open accounts and regular communication with members.' },
  ],

  focusAreas: [
    {
      icon: 'FileCheck2',
      tone: 'teal',
      title: 'Licences & approvals',
      text: 'Guidance on trade licences, GHMC requirements, fire NOC, FSSAI registration and other approvals a hostel needs.',
    },
    {
      icon: 'Flame',
      tone: 'gold',
      title: 'Safety & awareness',
      text: 'Awareness programmes on fire and LPG safety, kitchen hygiene, CCTV, resident registers and police verification.',
    },
    {
      icon: 'Landmark',
      tone: 'sky',
      title: 'Representation',
      text: 'Raising members’ issues on taxes, electricity and water charges, and local-body matters with the authorities.',
    },
    {
      icon: 'HeartHandshake',
      tone: 'mint',
      title: 'Member support',
      text: 'Help with day-to-day problems, disputes and local issues, and a network of fellow owners to learn from.',
    },
  ],

  membership: {
    // TODO: confirm tiers and fees. A tier with fee null shows "Fee announced soon".
    tiers: [
      {
        id: 'annual',
        name: 'Annual membership',
        fee: null, // e.g. 2000
        period: 'per year, per hostel',
        text: 'Access to support, guidance, awareness programmes and representation.',
      },
      {
        id: 'lifetime',
        name: 'Lifetime membership',
        fee: null,
        period: 'one time, per hostel',
        text: 'All annual benefits for life, with priority support.',
      },
    ],
    benefits: [
      'Support with local-body issues, inspections and approvals',
      'Guidance on licences, safety and compliance requirements',
      'Collective representation on taxes, electricity, water and rent matters',
      'Circulars, meeting notices and important updates sent directly to you',
      'Invitations to association meetings, workshops and awareness programmes',
      'A network of fellow hostel owners across the IT corridor',
    ],
    eligibility:
      'Owners and operators of hostels, PGs and co-living homes in the IT corridor who agree to follow the association’s rules and safety standards.',
    steps: [
      { icon: 'UserPlus', text: 'Fill in the application form with your details and your hostel.' },
      { icon: 'ClipboardCheck', text: 'The committee reviews and verifies your application.' },
      { icon: 'BadgeCheck', text: 'Once approved you receive your membership number and start getting notices.' },
    ],
  },
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/committee', label: 'Committee' },
  { href: '/membership', label: 'Membership' },
  { href: '/events', label: 'Events' },
  { href: '/notices', label: 'Notices' },
  { href: '/contact', label: 'Contact' },
];

export const HOSTEL_TYPES = [
  { id: 'boys', label: 'Boys / Men' },
  { id: 'girls', label: 'Girls / Women' },
  { id: 'coliving', label: 'Co-living' },
];

export const formatFee = (fee) => (fee == null ? null : `₹${Number(fee).toLocaleString('en-IN')}`);
