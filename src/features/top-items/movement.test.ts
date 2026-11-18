import { computeMovement, describeMovement } from './movement';

const items = (...ids: string[]) => ids.map((id) => ({ id }));

describe('computeMovement', () => {
    // Before: c #1, b #2, a #3. Now: a #1, b #2, c #3, d #4.
    const result = computeMovement(items('a', 'b', 'c', 'd'), items('c', 'b', 'a'));

    it('marks items that climbed', () => {
        expect(result.get('a')).toEqual({ kind: 'up', places: 2 });
    });

    it('marks items that dropped', () => {
        expect(result.get('c')).toEqual({ kind: 'down', places: 2 });
    });

    it('marks items that held their position', () => {
        expect(result.get('b')).toEqual({ kind: 'same' });
    });

    it('marks items that were not in the previous list as new', () => {
        expect(result.get('d')).toEqual({ kind: 'new' });
    });

    it('has an entry for every current item and nothing else', () => {
        expect([...result.keys()]).toEqual(['a', 'b', 'c', 'd']);
    });
});

describe('describeMovement', () => {
    it('reads naturally for screen readers', () => {
        expect(describeMovement({ kind: 'up', places: 1 }, 'the last 6 months')).toBe(
            'Up 1 place compared with the last 6 months',
        );
        expect(describeMovement({ kind: 'down', places: 4 }, 'all time')).toBe('Down 4 places compared with all time');
        expect(describeMovement({ kind: 'new' }, 'all time')).toBe('New, not in your top items for all time');
    });
});
