import { toTint } from './useArtworkTint';

describe('toTint', () => {
    it('keeps the hue and pins lightness low for readable white text', () => {
        expect(toTint(255, 0, 0)).toBe('hsl(0 70% 20%)');
        expect(toTint(0, 128, 255)).toBe('hsl(210 70% 20%)');
    });

    it('returns a neutral tint for greys', () => {
        expect(toTint(200, 200, 200)).toBe('hsl(0 0% 20%)');
    });
});
