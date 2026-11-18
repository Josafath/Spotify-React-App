// Spotify Authorization Code flow with PKCE, fully client-side.
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const CLIENT_ID: string =
    import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'd42c6ab495b64b16b144d4df732489ac';
// Must be registered exactly in the Spotify Developer Dashboard.
const REDIRECT_URI: string =
    import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/TopMusic`;
const SCOPES = 'user-top-read';

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const KEYS = {
    verifier: 'spotify_code_verifier',
    state: 'spotify_auth_state',
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expiresAt: 'spotify_expires_at',
} as const;

// Refresh a minute early so a token never expires mid-request.
const EXPIRY_MARGIN_MS = 60 * 1000;

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}

function randomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, (v) => possible[v % possible.length]).join('');
}

export async function createCodeChallenge(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export async function redirectToSpotifyAuth(): Promise<void> {
    const verifier = randomString(64);
    const state = randomString(16);
    const challenge = await createCodeChallenge(verifier);

    localStorage.setItem(KEYS.verifier, verifier);
    localStorage.setItem(KEYS.state, state);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
        code_challenge: challenge,
        state,
    });
    window.location.assign(`${AUTH_URL}?${params}`);
}

function saveTokens({ access_token, refresh_token, expires_in }: TokenResponse): void {
    localStorage.setItem(KEYS.accessToken, access_token);
    // Spotify may rotate the refresh token; keep the old one if none is returned.
    if (refresh_token) localStorage.setItem(KEYS.refreshToken, refresh_token);
    localStorage.setItem(KEYS.expiresAt, String(Date.now() + expires_in * 1000));
}

async function requestToken(body: Record<string, string>): Promise<string> {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: CLIENT_ID, ...body }),
    });
    const json = (await res.json().catch(() => ({}))) as Partial<TokenResponse> & {
        error?: string;
        error_description?: string;
    };
    if (!res.ok || !json.access_token || json.expires_in === undefined) {
        throw new Error(json.error_description || json.error || `Token request failed (${res.status})`);
    }
    saveTokens(json as TokenResponse);
    return json.access_token;
}

async function exchangeCode(params: URLSearchParams): Promise<string> {
    const expectedState = localStorage.getItem(KEYS.state);
    const verifier = localStorage.getItem(KEYS.verifier);
    localStorage.removeItem(KEYS.state);
    localStorage.removeItem(KEYS.verifier);

    const error = params.get('error');
    if (error) {
        throw new Error(
            error === 'access_denied'
                ? 'You declined access on Spotify, so there is nothing to show yet.'
                : `Spotify sign-in failed: ${error}`,
        );
    }
    if (!expectedState || params.get('state') !== expectedState) {
        throw new Error('This sign-in link expired or was opened twice. Please sign in again.');
    }
    if (!verifier) {
        throw new Error('This sign-in link expired or was opened twice. Please sign in again.');
    }
    return requestToken({
        grant_type: 'authorization_code',
        code: params.get('code') ?? '',
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
    });
}

async function resolveToken(): Promise<string | null> {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') || params.has('error')) {
        // The code is single-use: drop it from the URL so a reload doesn't reuse it.
        // Keep history.state, where React Router stores its own bookkeeping.
        window.history.replaceState(window.history.state, '', window.location.pathname);
        return exchangeCode(params);
    }

    const token = localStorage.getItem(KEYS.accessToken);
    const expiresAt = Number(localStorage.getItem(KEYS.expiresAt));
    if (token && Date.now() < expiresAt - EXPIRY_MARGIN_MS) return token;

    const refreshToken = localStorage.getItem(KEYS.refreshToken);
    if (refreshToken) {
        try {
            return await requestToken({ grant_type: 'refresh_token', refresh_token: refreshToken });
        } catch {
            logout();
        }
    }
    return null;
}

let pending: Promise<string | null> | null = null;

/**
 * Returns a valid access token, or null if the user has to sign in.
 * Concurrent callers share one request so the auth code is never exchanged twice.
 */
export function getAccessToken(): Promise<string | null> {
    if (!pending) {
        pending = resolveToken().finally(() => {
            pending = null;
        });
    }
    return pending;
}

/** True when a session (even an expired one that can be refreshed) is stored in this browser. */
export function hasStoredSession(): boolean {
    return Boolean(localStorage.getItem(KEYS.accessToken) || localStorage.getItem(KEYS.refreshToken));
}

export function logout(): void {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
