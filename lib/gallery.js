// Photo albums shown on /events (all) and the home page (featured).
// Files live in public/gallery/<slug>/NN.jpg with a NN-t.jpg thumbnail (640px).
// Titles are working names picked from what the photos show; date, time and location are
// left null (hidden) until ITCHA confirms them. Never guess them.

const p = (slug, id, w, h) => ({ src: `/gallery/${slug}/${id}.jpg`, thumb: `/gallery/${slug}/${id}-t.jpg`, w, h });

export const albums = [
  {
    slug: 'association-meeting',
    title: 'ITCHA association meeting',
    date: null, // 'YYYY-MM-DD'
    time: null, // e.g. '6:00 PM'
    location: null,
    photos: [
      p('association-meeting', '10', 1280, 960),
      p('association-meeting', '20', 1280, 576),
      p('association-meeting', '21', 1280, 960),
      p('association-meeting', '28', 1280, 960),
    ],
  },
  {
    slug: 'mla-welcome',
    title: 'Welcome for the Serilingampally MLA',
    date: null, // 'YYYY-MM-DD'
    time: null, // e.g. '6:00 PM'
    location: null,
    photos: [
      p('mla-welcome', '01', 1280, 852),
      p('mla-welcome', '02', 1280, 852),
      p('mla-welcome', '05', 1280, 960),
      p('mla-welcome', '08', 1280, 852),
      p('mla-welcome', '09', 1280, 852),
      p('mla-welcome', '19', 1280, 852),
      p('mla-welcome', '30', 1280, 852),
      p('mla-welcome', '36', 1280, 960),
      p('mla-welcome', '39', 1280, 852),
      p('mla-welcome', '42', 1280, 720),
      p('mla-welcome', '47', 1280, 852),
      p('mla-welcome', '48', 1280, 852),
    ],
  },
  {
    slug: 'sports-arena',
    title: 'Felicitation at the sports arena',
    date: null, // 'YYYY-MM-DD'
    time: null, // e.g. '6:00 PM'
    location: null,
    photos: [
      p('sports-arena', '12', 1280, 963),
      p('sports-arena', '23', 1280, 963),
      p('sports-arena', '37', 1024, 768),
      p('sports-arena', '46', 1024, 768),
    ],
  },
  {
    slug: 'gatherings',
    title: 'Member gatherings',
    date: null, // 'YYYY-MM-DD'
    time: null, // e.g. '6:00 PM'
    location: null,
    photos: [
      p('gatherings', '03', 1040, 480),
      p('gatherings', '11', 1280, 720),
      p('gatherings', '15', 960, 1280),
      p('gatherings', '26', 792, 1280),
      p('gatherings', '27', 1280, 717),
      p('gatherings', '34', 1280, 960),
    ],
  },
  {
    slug: 'courtesy-visits',
    title: 'Courtesy visits and meetings',
    date: null, // 'YYYY-MM-DD'
    time: null, // e.g. '6:00 PM'
    location: null,
    photos: [
      p('courtesy-visits', '04', 1280, 960),
      p('courtesy-visits', '06', 1280, 960),
      p('courtesy-visits', '07', 960, 1280),
      p('courtesy-visits', '14', 1280, 960),
      p('courtesy-visits', '16', 581, 1280),
      p('courtesy-visits', '25', 1024, 768),
      p('courtesy-visits', '31', 960, 1280),
      p('courtesy-visits', '32', 1156, 867),
      p('courtesy-visits', '33', 1280, 581),
      p('courtesy-visits', '35', 1280, 581),
      p('courtesy-visits', '38', 960, 1280),
      p('courtesy-visits', '43', 1280, 581),
      p('courtesy-visits', '44', 1280, 960),
      p('courtesy-visits', '45', 768, 1024),
      p('courtesy-visits', '49', 581, 1280),
    ],
  },
];

// Home page picks, in display order: [album slug, photo id].
const FEATURED = [
  ['association-meeting', '10'],
  ['mla-welcome', '19'],
  ['sports-arena', '12'],
  ['association-meeting', '28'],
  ['mla-welcome', '01'],
  ['gatherings', '26'],
  ['mla-welcome', '47'],
  ['association-meeting', '21'],
];

export function featuredPhotos() {
  return FEATURED.map(([slug, id]) => {
    const album = albums.find((a) => a.slug === slug);
    const photo = album?.photos.find((x) => x.src.endsWith(`/${id}.jpg`));
    return photo && { ...photo, album: album.title, albumSlug: slug };
  }).filter(Boolean);
}
