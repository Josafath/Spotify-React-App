// Spotify Authorization Code flow with PKCE.
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const CLIENT_ID =
    import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'd42c6ab495b64b16b144d4df732489ac';
// Must be registered exactly in the Spotify Developer Dashboard.
const REDIRECT_URI =
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
};

// Refresh a minute early so a token never expires mid-request.
const EXPIRY_MARGIN_MS = 60 * 1000;

function randomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values, (v) => possible[v % possible.length]).join('');
}

export async function createCodeChallenge(verifier) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export async function redirectToSpotifyAuth() {
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

function saveTokens({ access_token, refresh_token, expires_in }) {
    localStorage.setItem(KEYS.accessToken, access_token);
    // Spotify may rotate the refresh token; keep the old one if none is returned.
    if (refresh_token) localStorage.setItem(KEYS.refreshToken, refresh_token);
    localStorage.setItem(KEYS.expiresAt, String(Date.now() + expires_in * 1000));
}

async function requestToken(body) {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: CLIENT_ID, ...body }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(json.error_description || json.error || `Token request failed (${res.status})`);
    }
    saveTokens(json);
    return json.access_token;
}

async function exchangeCode(params) {
    const expectedState = localStorage.getItem(KEYS.state);
    const verifier = localStorage.getItem(KEYS.verifier);
    localStorage.removeItem(KEYS.state);
    localStorage.removeItem(KEYS.verifier);

    if (params.get('error')) {
        throw new Error(`Spotify denied access: ${params.get('error')}`);
    }
    if (!expectedState || params.get('state') !== expectedState) {
        throw new Error('Invalid auth state. Please sign in again.');
    }
    if (!verifier) {
        throw new Error('Missing code verifier. Please sign in again.');
    }
    return requestToken({
        grant_type: 'authorization_code',
        code: params.get('code'),
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
    });
}

async function resolveToken() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') || params.has('error')) {
        // The code is single-use: drop it from the URL so a reload doesn't reuse it.
        window.history.replaceState(null, '', window.location.pathname);
        return exchangeCode(params);
    }

    const token = localStorage.getItem(KEYS.accessToken);
    const expiresAt = Number(localStorage.getItem(KEYS.expiresAt));
    if (token && Date.now() < expiresAt - EXPIRY_MARGIN_MS) return token;

    const refreshToken = localStorage.getItem(KEYS.refreshToken);
    if (refreshToken) {
        try {
            return await requestToken({ grant_type: 'refresh_token', refresh_token: refreshToken });
        } catch (err) {
            logout();
        }
    }
    return null;
}

let pending = null;

// Returns a valid access token, or null if the user has to sign in.
// Concurrent callers share one request so the auth code is never exchanged twice.
export function getAccessToken() {
    if (!pending) {
        pending = resolveToken().finally(() => {
            pending = null;
        });
    }
    return pending;
}

export function logout() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
