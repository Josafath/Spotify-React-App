// Spotify's official iFrame API for embedded players.
// https://developer.spotify.com/documentation/embeds/references/iframe-api

const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
const LOAD_TIMEOUT_MS = 8000;

export interface EmbedController {
    loadUri(uri: string): void;
    play(): void;
    togglePlay(): void;
    destroy(): void;
    addListener(event: 'ready', callback: () => void): void;
    addListener(event: 'playback_update', callback: (e: { data: { isPaused: boolean } }) => void): void;
}

export interface IFrameAPI {
    createController(
        element: HTMLElement,
        options: { uri: string; width?: string | number; height?: string | number },
        callback: (controller: EmbedController) => void,
    ): void;
}

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    }
}

let loading: Promise<IFrameAPI> | null = null;

/** Loads the iFrame API once. Rejects if it can't load (offline, blocked), so callers can fall back to a plain embed. */
export function loadIframeApi(): Promise<IFrameAPI> {
    if (loading) return loading;

    loading = new Promise<IFrameAPI>((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error('Spotify player did not load')), LOAD_TIMEOUT_MS);
        window.onSpotifyIframeApiReady = (api) => {
            window.clearTimeout(timer);
            resolve(api);
        };
        const script = document.createElement('script');
        script.src = API_SRC;
        script.async = true;
        script.onerror = () => {
            window.clearTimeout(timer);
            reject(new Error('Spotify player did not load'));
        };
        document.head.appendChild(script);
    });

    // Allow a later retry after a failure.
    loading.catch(() => {
        loading = null;
    });
    return loading;
}

/** spotify:track:abc → https://open.spotify.com/embed/track/abc, for the no-API fallback. */
export function embedUrl(uri: string): string {
    const [, type, id] = uri.split(':');
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=jossify`;
}
