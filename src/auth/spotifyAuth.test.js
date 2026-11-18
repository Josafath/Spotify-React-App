import { getAccessToken } from './spotifyAuth';

const jsonResponse = (body, ok = true) =>
    Promise.resolve({ ok, status: ok ? 200 : 400, json: () => Promise.resolve(body) });

const sentBody = (call = 0) => fetch.mock.calls[call][1].body;

const startCallback = (query) => {
    localStorage.setItem('spotify_auth_state', 'xyz');
    localStorage.setItem('spotify_code_verifier', 'verifier123');
    window.history.replaceState(null, '', `/TopMusic?${query}`);
};

beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/TopMusic');
    global.fetch = jest.fn();
});

test('returns null when there is no session', async () => {
    await expect(getAccessToken()).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
});

test('exchanges the auth code when the state matches', async () => {
    startCallback('code=abc&state=xyz');
    fetch.mockReturnValue(jsonResponse({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600 }));

    await expect(getAccessToken()).resolves.toBe('AT');

    expect(fetch.mock.calls[0][0]).toBe('https://accounts.spotify.com/api/token');
    const body = sentBody();
    expect(body.get('grant_type')).toBe('authorization_code');
    expect(body.get('code')).toBe('abc');
    expect(body.get('code_verifier')).toBe('verifier123');
    expect(body.get('redirect_uri')).toBe('http://localhost/TopMusic');
    // The single-use code is removed from the URL and the one-time values are cleared.
    expect(window.location.search).toBe('');
    expect(localStorage.getItem('spotify_code_verifier')).toBeNull();
    expect(localStorage.getItem('spotify_auth_state')).toBeNull();
    expect(localStorage.getItem('spotify_refresh_token')).toBe('RT');
});

test('rejects a callback whose state does not match', async () => {
    startCallback('code=abc&state=attacker');

    await expect(getAccessToken()).rejects.toThrow('Invalid auth state');
    expect(fetch).not.toHaveBeenCalled();
});

test('rejects when Spotify reports an error', async () => {
    startCallback('error=access_denied&state=xyz');

    await expect(getAccessToken()).rejects.toThrow('access_denied');
    expect(fetch).not.toHaveBeenCalled();
});

test('concurrent callers share a single code exchange', async () => {
    startCallback('code=abc&state=xyz');
    fetch.mockReturnValue(jsonResponse({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600 }));

    const results = await Promise.all([getAccessToken(), getAccessToken()]);

    expect(results).toEqual(['AT', 'AT']);
    expect(fetch).toHaveBeenCalledTimes(1);
});

test('returns the stored token while it is still valid', async () => {
    localStorage.setItem('spotify_access_token', 'AT');
    localStorage.setItem('spotify_expires_at', String(Date.now() + 3600 * 1000));

    await expect(getAccessToken()).resolves.toBe('AT');
    expect(fetch).not.toHaveBeenCalled();
});

test('refreshes an expired token and keeps the refresh token if none is returned', async () => {
    localStorage.setItem('spotify_access_token', 'OLD');
    localStorage.setItem('spotify_expires_at', String(Date.now() - 1));
    localStorage.setItem('spotify_refresh_token', 'RT');
    fetch.mockReturnValue(jsonResponse({ access_token: 'NEW', expires_in: 3600 }));

    await expect(getAccessToken()).resolves.toBe('NEW');

    const body = sentBody();
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe('RT');
    expect(localStorage.getItem('spotify_refresh_token')).toBe('RT');
});

test('clears the session when the refresh fails', async () => {
    localStorage.setItem('spotify_access_token', 'OLD');
    localStorage.setItem('spotify_expires_at', String(Date.now() - 1));
    localStorage.setItem('spotify_refresh_token', 'RT');
    fetch.mockReturnValue(jsonResponse({ error: 'invalid_grant' }, false));

    await expect(getAccessToken()).resolves.toBeNull();
    expect(localStorage.getItem('spotify_access_token')).toBeNull();
    expect(localStorage.getItem('spotify_refresh_token')).toBeNull();
});
