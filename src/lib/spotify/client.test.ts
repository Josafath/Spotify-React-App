import { SpotifyApiError, spotifyGet } from './client';
import { getAccessToken, logout } from './auth';

vi.mock('./auth', () => ({ getAccessToken: vi.fn(), logout: vi.fn() }));

const fetchMock = vi.fn<typeof fetch>();
const respond = (status: number, body: unknown) =>
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status }));

beforeEach(() => {
    vi.mocked(getAccessToken).mockResolvedValue('AT');
    vi.mocked(logout).mockReset();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
});

it('sends the bearer token and returns the parsed body', async () => {
    respond(200, { id: 'me' });

    await expect(spotifyGet('/me')).resolves.toEqual({ id: 'me' });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.spotify.com/v1/me');
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer AT');
});

it('fails as an auth error without calling Spotify when there is no session', async () => {
    vi.mocked(getAccessToken).mockResolvedValue(null);

    const error = await spotifyGet('/me').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SpotifyApiError);
    expect((error as SpotifyApiError).isAuthError).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
});

it('clears the session on 401 and surfaces Spotify’s message', async () => {
    respond(401, { error: { status: 401, message: 'The access token expired' } });

    const error = (await spotifyGet('/me').catch((e: unknown) => e)) as SpotifyApiError;

    expect(error.isAuthError).toBe(true);
    expect(error.message).toBe('The access token expired');
    expect(logout).toHaveBeenCalledTimes(1);
});

it('flags rate limiting', async () => {
    respond(429, { error: { status: 429, message: 'API rate limit exceeded' } });

    const error = (await spotifyGet('/me').catch((e: unknown) => e)) as SpotifyApiError;

    expect(error.isRateLimited).toBe(true);
    expect(logout).not.toHaveBeenCalled();
});
