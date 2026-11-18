import { screen } from '@testing-library/react';
import { getAccessToken } from '@/lib/spotify/auth';
import type * as AuthModule from '@/lib/spotify/auth';
import type { Track } from '@/lib/spotify/types';
import { renderApp } from '@/test/renderApp';

vi.mock('@/lib/spotify/auth', async (importOriginal) => ({
    ...(await importOriginal<typeof AuthModule>()),
    getAccessToken: vi.fn(),
    redirectToSpotifyAuth: vi.fn(),
}));

const track = (id: string, name: string): Track => ({
    id,
    uri: `spotify:track:${id}`,
    name,
    duration_ms: 200_000,
    explicit: false,
    preview_url: null,
    external_urls: { spotify: `https://open.spotify.com/track/${id}` },
    artists: [
        {
            id: 'artist',
            uri: 'spotify:artist:x',
            name: 'Some Artist',
            external_urls: { spotify: 'https://open.spotify.com/artist/x' },
        },
    ],
    album: { id: 'album', name: 'Some Album', images: [{ url: 'https://i.scdn.co/cover', width: 640, height: 640 }] },
});

const fetchMock = vi.fn<typeof fetch>();

function mockSpotify(routes: Record<string, { status?: number; body: unknown }>) {
    fetchMock.mockImplementation(async (input) => {
        const url = String(input);
        const match = Object.entries(routes).find(([fragment]) => url.includes(fragment));
        if (!match) return new Response('{}', { status: 404 });
        return new Response(JSON.stringify(match[1].body), { status: match[1].status ?? 200 });
    });
}

beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
});

it('sends signed-out visitors back to the start page', async () => {
    vi.mocked(getAccessToken).mockResolvedValue(null);
    renderApp('/TopMusic');

    expect(await screen.findByRole('heading', { level: 1, name: /Your listening/ })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
});

it('explains a failed sign-in instead of failing silently', async () => {
    vi.mocked(getAccessToken).mockRejectedValue(new Error('You declined access on Spotify.'));
    renderApp('/TopMusic');

    expect(await screen.findByRole('alert')).toHaveTextContent('You declined access on Spotify.');
});

it('loads the signed-in user’s top tracks with their token', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('AT');
    mockSpotify({
        '/me/top/tracks?time_range=short_term': { body: { items: [track('1', 'First Song'), track('2', 'Second Song')] } },
        '/me/top/tracks?time_range=medium_term': { body: { items: [track('2', 'Second Song'), track('1', 'First Song')] } },
        '/me?': { body: {} },
        '/me': { body: { id: 'u', display_name: 'Ana', images: [], external_urls: { spotify: 'https://open.spotify.com/user/u' } } },
    });
    renderApp('/TopMusic');

    expect(await screen.findByRole('heading', { level: 2, name: 'First Song' })).toBeInTheDocument();
    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getAllByTitle('Up 1 place compared with the last 6 months')).toHaveLength(1);
    const calls = fetchMock.mock.calls.map(([url]) => String(url));
    expect(calls.some((url) => url.includes('time_range=short_term&limit=40'))).toBe(true);
});

it('asks the user to sign in again when the session has expired', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('AT');
    mockSpotify({
        '/me/top': { status: 401, body: { error: { status: 401, message: 'The access token expired' } } },
        '/me': { body: { id: 'u', display_name: 'Ana', images: [], external_urls: { spotify: 'x' } } },
    });
    renderApp('/TopMusic');

    expect(await screen.findByRole('heading', { name: 'Your Spotify session ended' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in again' })).toBeInTheDocument();
});

it('shows an empty state when Spotify has no ranking yet', async () => {
    vi.mocked(getAccessToken).mockResolvedValue('AT');
    mockSpotify({
        '/me/top': { body: { items: [] } },
        '/me': { body: { id: 'u', display_name: 'Ana', images: [], external_urls: { spotify: 'x' } } },
    });
    renderApp('/TopMusic');

    expect(await screen.findByRole('heading', { name: 'Not enough listening yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show all time' })).toBeInTheDocument();
});
