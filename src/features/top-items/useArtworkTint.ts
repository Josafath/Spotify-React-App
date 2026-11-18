import { useEffect, useState } from 'react';

const cache = new Map<string, string | null>();

/** Converts an average RGB colour to a deep, saturated tint that white text stays readable on. */
export function toTint(r: number, g: number, b: number): string {
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const delta = max - min;
    let hue = 0;
    if (delta > 0) {
        if (max === r / 255) hue = ((g - b) / 255 / delta) % 6;
        else if (max === g / 255) hue = (b - r) / 255 / delta + 2;
        else hue = (r - g) / 255 / delta + 4;
    }
    hue = Math.round((hue * 60 + 360) % 360);
    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    // Clamp: keep the hue, cap saturation and pin lightness low so the wash never fights the text.
    return `hsl(${hue} ${Math.round(Math.min(saturation, 0.7) * 100)}% 20%)`;
}

function sample(url: string): Promise<string | null> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
                resolve(toTint(r, g, b));
            } catch {
                // Cross-origin image without CORS headers: no tint, the page still works.
                resolve(null);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

/** A dark tint derived from an artwork's average colour, or null while loading or when unavailable. */
export function useArtworkTint(url: string | undefined): string | null {
    const [tint, setTint] = useState<string | null>(() => (url ? (cache.get(url) ?? null) : null));

    useEffect(() => {
        if (!url) {
            setTint(null);
            return;
        }
        if (cache.has(url)) {
            setTint(cache.get(url) ?? null);
            return;
        }
        let cancelled = false;
        void sample(url).then((value) => {
            cache.set(url, value);
            if (!cancelled) setTint(value);
        });
        return () => {
            cancelled = true;
        };
    }, [url]);

    return tint;
}
