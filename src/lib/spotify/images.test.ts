import { formatDuration, pickImage } from './images';

const images = [
    { url: 'large', width: 640, height: 640 },
    { url: 'medium', width: 300, height: 300 },
    { url: 'small', width: 64, height: 64 },
];

describe('pickImage', () => {
    it('picks the smallest image that is still big enough', () => {
        expect(pickImage(images, 48)).toBe('small');
        expect(pickImage(images, 200)).toBe('medium');
        expect(pickImage(images, 600)).toBe('large');
    });

    it('falls back to the largest image when none is big enough', () => {
        expect(pickImage(images, 1000)).toBe('large');
    });

    it('handles missing images', () => {
        expect(pickImage([], 64)).toBeUndefined();
        expect(pickImage(undefined, 64)).toBeUndefined();
    });
});

describe('formatDuration', () => {
    it('formats milliseconds as m:ss', () => {
        expect(formatDuration(215_000)).toBe('3:35');
        expect(formatDuration(61_400)).toBe('1:01');
        expect(formatDuration(9_000)).toBe('0:09');
    });
});
