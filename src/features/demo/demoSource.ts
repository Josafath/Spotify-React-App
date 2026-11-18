// Offline demo data. Every artist, track and cover here is fictional and generated,
// so people without Spotify access (for example while the app is in Spotify's
// development mode) can still explore Jossify. The UI labels it as demo data.

import type { Artist, SpotifyImage, TimeRange, Track, UserProfile } from '@/lib/spotify/types';
import type { MusicSource } from '@/features/top-items/musicSource';
import { TOP_ITEMS_LIMIT } from '@/features/top-items/musicSource';

const ARTISTS = [
    'Velvet Harbor', 'Mira Solano', 'The Paper Lanterns', 'Juno Okafor', 'Glass Orchard',
    'Ten Quiet Rooms', 'Lua Ferraz', 'Night Bus Choir', 'Odile & The Tides', 'Kestrel Park',
    'Sun Cellar', 'Ana Varga', 'Low Comet', 'Marigold Static', 'Teodor Lind',
    'Coastal Fever', 'Ines Navarro', 'Bright Hollow', 'Yuki Arai', 'The Long Afternoons',
    'Saltwater Radio', 'Remi Laurent', 'Pale Engines', 'Dalia Moreno', 'Copper Moth',
    'North of June', 'Hana Brook', 'Field Recordings Club', 'Tomas Ek', 'Wild Antenna',
    'Selma Day', 'Quiet Parade', 'Arlo Vance', 'Blue Ferns', 'Noor Haddad',
    'Lantern Season', 'Pim Visser', 'The Slow Lights', 'Elena Brandt', 'Harbor Kids',
];

const TITLES = [
    'Paper Moons', 'Slow Motion Summer', 'Lighthouse', 'Every Other Sunday', 'Static Bloom',
    'Northbound', 'Honey & Rust', 'Small Hours', 'Parallel Lines', 'Velvet Dark',
    'Tidal', 'Weekend Ghosts', 'Overgrown', 'Satellite Hearts', 'Blue Hour Drive',
    'Undertow', 'Glasshouse', 'Coastline', 'Half Awake', 'Neon Orchard',
    'Fever Dream', 'Second Language', 'Rooftop Season', 'Low Tide', 'Kerosene',
    'Golden Static', 'Windows Down', 'Afterglow Avenue', 'Cold Water', 'Marble Sky',
    'Long Way Home', 'Sundial', 'Echo Chamber', 'Wildflower Bus', 'Silver Thread',
    'Quiet Riot Girl', 'Paper Planes Again', 'Daylight Savings', 'Gravity Well', 'Last Ferry',
    'Holding Pattern', 'Nightjar', 'Summer Static', 'Hourglass', 'Open Water',
];

const ALBUMS = [
    'Rooms Without Clocks', 'A Map of Small Fires', 'Tender Machinery', 'Low Season', 'Pale Blue Hours',
    'Everything Is Weather', 'Kitchen Light', 'The Long Middle', 'Signal & Noise', 'Second Summer',
    'Harbor Lights', 'Soft Architecture', 'Night Swimming Club', 'Greenhouse in June', 'Field Notes',
];

const GENRES = [
    ['indie pop', 'dream pop'], ['art pop'], ['indie folk', 'chamber folk'], ['alt r&b', 'neo soul'],
    ['shoegaze', 'dream pop'], ['post-rock'], ['mpb', 'bossa nova'], ['indie rock'],
    ['synthpop', 'new wave'], ['bedroom pop'],
];

// Deterministic PRNG so the demo looks the same on every visit.
function mulberry32(seed: number) {
    let a = seed;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hash(text: string): number {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return h >>> 0;
}

const escapeXml = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Film grain shared by every cover, so flat fields read as printed sleeves rather than vectors.
const GRAIN = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0"/></filter>`;

// Safe area for cover type: a centred 420px square fits inside both the square cover
// and the circle that artist photos are cropped to (inscribed square is ~452px).
const TYPE_SAFE = 420;

/** Stacks a title in at most three centred lines, each forced to fit the safe area. */
function typeStack(label: string, color: string): string {
    const words = label.toUpperCase().split(/\s+/).filter(Boolean);
    const lines = words.length <= 3 ? words : [words[0]!, words[1]!, words.slice(2).join(' ')];
    const sizes = lines.map((line) => Math.min(120, TYPE_SAFE / (Math.max(line.length, 3) * 0.66)));
    const lineHeight = Math.max(...sizes) * 1.02;
    const firstBaseline = 320 - ((lines.length - 1) * lineHeight) / 2;

    return lines
        .map((line, i) => {
            const size = sizes[i]!;
            const width = Math.min(TYPE_SAFE, line.length * size * 0.66);
            return `<text x="320" y="${firstBaseline + i * lineHeight + size * 0.36}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="${size}" textLength="${width}" lengthAdjust="spacingAndGlyphs" fill="${color}">${escapeXml(line)}</text>`;
        })
        .join('');
}

/**
 * A generated, abstract cover in one of six compositions (shapes, type, gradient,
 * rings, stripes, blocks). Deterministic per seed. Never derived from real artwork.
 */
function coverArt(seedText: string, label: string): SpotifyImage[] {
    const rand = mulberry32(hash(seedText));
    const hue = Math.floor(rand() * 360);
    const bg = `hsl(${hue} 45% ${16 + Math.floor(rand() * 16)}%)`;
    const a = `hsl(${(hue + 40 + rand() * 80) % 360} 72% ${55 + rand() * 15}%)`;
    const b = `hsl(${(hue + 180 + rand() * 40) % 360} 55% ${70 + rand() * 12}%)`;
    const x = 140 + rand() * 360;
    const y = 140 + rand() * 360;
    const compositions = [
        // Shapes: sun over a horizon.
        `<circle cx="${x}" cy="${y}" r="${150 + rand() * 90}" fill="${a}"/><rect x="0" y="${440 + rand() * 120}" width="640" height="200" fill="${b}"/>`,
        // Type: the title stacked at sleeve scale, always inside the safe area.
        `<rect x="0" y="0" width="640" height="640" fill="${a}"/>${typeStack(label, bg)}`,
        // Gradient field with a single disc.
        `<defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${bg}"/></linearGradient></defs><rect width="640" height="640" fill="url(#l)"/><circle cx="${x}" cy="${y}" r="${60 + rand() * 40}" fill="${b}"/>`,
        // Rings.
        Array.from({ length: 6 }, (_, i) => `<circle cx="320" cy="320" r="${290 - i * 46}" fill="${i % 2 ? bg : a}"/>`).join(''),
        // Stripes.
        Array.from({ length: 8 }, (_, i) => `<rect x="0" y="${i * 80}" width="640" height="${20 + rand() * 50}" fill="${i % 3 === 0 ? b : a}"/>`).join(''),
        // Blocks.
        `<rect x="40" y="40" width="${240 + rand() * 120}" height="${240 + rand() * 120}" fill="${a}"/><rect x="${300 + rand() * 60}" y="${300 + rand() * 60}" width="240" height="240" fill="${b}"/>`,
    ];
    const shapes = compositions[Math.floor(rand() * compositions.length)];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">${GRAIN}<rect width="640" height="640" fill="${bg}"/>${shapes}<rect width="640" height="640" filter="url(#g)"/></svg>`;
    const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    return [{ url, width: 640, height: 640 }];
}

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const artists: Artist[] = ARTISTS.map((name, i) => ({
    id: `demo-artist-${slug(name)}`,
    uri: `spotify:artist:demo-${slug(name)}`,
    name,
    images: coverArt(`artist:${name}`, name),
    genres: GENRES[i % GENRES.length],
    external_urls: { spotify: 'https://open.spotify.com/' },
}));

const tracks: Track[] = TITLES.map((title, i) => {
    const artist = artists[(i * 7) % artists.length]!;
    return {
        id: `demo-track-${slug(title)}`,
        uri: `spotify:track:demo-${slug(title)}`,
        name: title,
        duration_ms: 150_000 + ((i * 37_123) % 140_000),
        explicit: i % 9 === 4,
        preview_url: null,
        external_urls: { spotify: 'https://open.spotify.com/' },
        artists: [{ id: artist.id, name: artist.name, uri: artist.uri, external_urls: artist.external_urls }],
        album: {
            id: `demo-album-${i}`,
            name: ALBUMS[(i * 3) % ALBUMS.length]!,
            images: coverArt(`album:${title}`, title),
        },
    };
});

/** A stable, range-specific ordering so ranges differ and movement is visible. */
function rankFor<T>(items: T[], range: TimeRange): T[] {
    const seed = { short_term: 11, medium_term: 23, long_term: 37 }[range];
    const rand = mulberry32(seed);
    // Bias toward the base order so the three ranges overlap like real listening does.
    return items
        .map((item, index) => ({ item, score: index + rand() * (range === 'short_term' ? 22 : 12) }))
        .sort((x, y) => x.score - y.score)
        .map(({ item }) => item)
        .slice(0, TOP_ITEMS_LIMIT);
}

const profile: UserProfile = {
    id: 'demo',
    display_name: 'Demo listener',
    images: [],
    external_urls: { spotify: 'https://open.spotify.com/' },
};

export function demoTracks(range: TimeRange): Track[] {
    return rankFor(tracks, range);
}

export function demoArtists(range: TimeRange): Artist[] {
    return rankFor(artists, range);
}

export const demoSource: MusicSource = {
    kind: 'demo',
    async getTopItems(type, range) {
        const list = type === 'tracks' ? demoTracks(range) : demoArtists(range);
        return list as never;
    },
    async getProfile() {
        return profile;
    },
};
