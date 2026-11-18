import { createHash } from 'node:crypto';
import { createCodeChallenge, getAccessToken, hasStoredSession } from './auth';

const fetchMock = vi.fn<typeof fetch>();

const jsonResponse = (body: unknown, ok = true) =>
    Promise.resolve({ ok, status: ok ? 200 : 400, json: () => Promise.resolve(body) } as Response);

const sentBody = (call = 0) => fetchMock.mock.calls[call]![1]!.body as URLSearchParams;

const startCallback = (query: string) => {
    localStorage.setItem('spotify_auth_state', 'xyz');
    localStorage.setItem('spotify_code_verifier', 'verifier123');
    window.history.replaceState(null, '', `/TopMusic?${query}`);
};

beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/TopMusic');
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
});

describe('createCodeChallenge', () => {
    it('is the base64url SHA-256 of the verifier (RFC 7636)', async () => {
        const verifier = 'dBjftJeZ4CVP-mJ92hC5hHkVW9gydTyQ6n1Uf8fCp0';
        const expected = createHash('sha256').update(verifier).digest('base64url');
        await expect(createCodeChallenge(verifier)).resolves.toBe(expected);
    });
});

describe('getAccessToken', () => {
    it('returns null when there is no session', async () => {
        await expect(getAccessToken()).resolves.toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('exchanges the auth code when the state matches', async () => {
        startCallback('code=abc&state=xyz');
        fetchMock.mockReturnValue(jsonResponse({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600 }));

        await expect(getAccessToken()).resolves.toBe('AT');

        expect(fetchMock.mock.calls[0]![0]).toBe('https://accounts.spotify.com/api/token');
        const body = sentBody();
        expect(body.get('grant_type')).toBe('authorization_code');
        expect(body.get('code')).toBe('abc');
        expect(body.get('code_verifier')).toBe('verifier123');
        expect(body.get('redirect_uri')).toBe('http://127.0.0.1:3000/TopMusic');
        // The single-use code is removed from the URL and the one-time values are cleared.
        expect(window.location.search).toBe('');
        expect(localStorage.getItem('spotify_code_verifier')).toBeNull();
        expect(localStorage.getItem('spotify_auth_state')).toBeNull();
        expect(hasStoredSession()).toBe(true);
    });

    it('rejects a callback whose state does not match', async () => {
        startCallback('code=abc&state=attacker');

        await expect(getAccessToken()).rejects.toThrow('sign in again');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('explains when the user declined access on Spotify', async () => {
        startCallback('error=access_denied&state=xyz');

        await expect(getAccessToken()).rejects.toThrow('You declined access');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('shares a single code exchange between concurrent callers', async () => {
        startCallback('code=abc&state=xyz');
        fetchMock.mockReturnValue(jsonResponse({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600 }));

        const results = await Promise.all([getAccessToken(), getAccessToken()]);

        expect(results).toEqual(['AT', 'AT']);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('returns the stored token while it is still valid', async () => {
        localStorage.setItem('spotify_access_token', 'AT');
        localStorage.setItem('spotify_expires_at', String(Date.now() + 3600 * 1000));

        await expect(getAccessToken()).resolves.toBe('AT');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('refreshes an expired token and keeps the refresh token if none is returned', async () => {
        localStorage.setItem('spotify_access_token', 'OLD');
        localStorage.setItem('spotify_expires_at', String(Date.now() - 1));
        localStorage.setItem('spotify_refresh_token', 'RT');
        fetchMock.mockReturnValue(jsonResponse({ access_token: 'NEW', expires_in: 3600 }));

        await expect(getAccessToken()).resolves.toBe('NEW');

        const body = sentBody();
        expect(body.get('grant_type')).toBe('refresh_token');
        expect(body.get('refresh_token')).toBe('RT');
        expect(localStorage.getItem('spotify_refresh_token')).toBe('RT');
    });

    it('clears the session when the refresh fails', async () => {
        localStorage.setItem('spotify_access_token', 'OLD');
        localStorage.setItem('spotify_expires_at', String(Date.now() - 1));
        localStorage.setItem('spotify_refresh_token', 'RT');
        fetchMock.mockReturnValue(jsonResponse({ error: 'invalid_grant' }, false));

        await expect(getAccessToken()).resolves.toBeNull();
        expect(hasStoredSession()).toBe(false);
    });
});
