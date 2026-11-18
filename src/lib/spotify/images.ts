import type { SpotifyImage } from './types';

/**
 * Picks the smallest image that is still at least `minSize` px wide (Spotify returns
 * several sizes, largest first). Falls back to the largest one available.
 */
export function pickImage(images: readonly SpotifyImage[] | undefined, minSize: number): string | undefined {
    if (!images || images.length === 0) return undefined;
    const sorted = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
    return (sorted.find((img) => (img.width ?? 0) >= minSize) ?? sorted[sorted.length - 1])?.url;
}

export function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}
