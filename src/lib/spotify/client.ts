import { getAccessToken, logout } from './auth';

const API_BASE = 'https://api.spotify.com/v1';

export class SpotifyApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = 'SpotifyApiError';
        this.status = status;
    }

    /** The session is missing or expired; the user has to sign in again. */
    get isAuthError(): boolean {
        return this.status === 401;
    }

    get isRateLimited(): boolean {
        return this.status === 429;
    }
}

async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as { error?: { message?: string } };
        if (body.error?.message) return body.error.message;
    } catch {
        // Non-JSON error body; fall through to the status text.
    }
    return res.statusText || `Request failed (${res.status})`;
}

/** GET a Spotify Web API path with the current user's token. */
export async function spotifyGet<T>(path: string, init: { signal?: AbortSignal } = {}): Promise<T> {
    const token = await getAccessToken();
    if (!token) throw new SpotifyApiError(401, 'You are not signed in.');

    const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: init.signal,
    });

    if (!res.ok) {
        const message = await readErrorMessage(res);
        if (res.status === 401) logout();
        throw new SpotifyApiError(res.status, message);
    }
    return (await res.json()) as T;
}
