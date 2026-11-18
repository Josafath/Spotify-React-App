import { useRef } from 'react';
import { render } from '@testing-library/react';
import { useFlipList } from './useFlipList';

const ROW_HEIGHT = 72;

function List({ ids }: { ids: string[] }) {
    const ref = useRef<HTMLOListElement>(null);
    const overlay = useRef<HTMLDivElement>(null);
    useFlipList(ref, overlay, ids.join('|'));
    return (
        <div>
            <div ref={overlay} data-testid="overlay" />
            <ol ref={ref}>
                {ids.map((id) => (
                    <li key={id} data-flip-id={id}>
                        {id}
                    </li>
                ))}
            </ol>
        </div>
    );
}

// Like the browser, return an Animation-like object the hook can attach handlers to.
const animate = vi.fn<(keyframes: Keyframe[], options?: KeyframeAnimationOptions) => Partial<Animation>>(() => ({
    onfinish: null,
    oncancel: null,
}));

beforeAll(() => {
    // jsdom has no layout: place each row by its index, and record animations.
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
        configurable: true,
        get(this: HTMLElement) {
            return this.parentElement ? [...this.parentElement.children].indexOf(this) * ROW_HEIGHT : 0;
        },
    });
    HTMLElement.prototype.animate = animate as unknown as HTMLElement['animate'];
});

beforeEach(() => animate.mockClear());

const callFor = (container: HTMLElement, id: string) => {
    const row = container.querySelector(`[data-flip-id="${id}"]`);
    return animate.mock.contexts.findIndex((ctx) => ctx === row);
};

it('does not animate the first render', () => {
    render(<List ids={['a', 'b', 'c']} />);
    expect(animate).not.toHaveBeenCalled();
});

it('slides moved rows from their old position and fades in new ones', () => {
    const { container, rerender } = render(<List ids={['a', 'b', 'c']} />);
    rerender(<List ids={['c', 'a', 'd']} />);

    // c moved from index 2 to 0: it starts 144px lower and slides up.
    const c = animate.mock.calls[callFor(container, 'c')]!;
    expect(c[0]).toEqual([{ transform: `translateY(${2 * ROW_HEIGHT}px)` }, { transform: 'none' }]);

    // a moved from 0 to 1: it starts 72px higher and slides down.
    const a = animate.mock.calls[callFor(container, 'a')]!;
    expect(a[0]).toEqual([{ transform: `translateY(${-ROW_HEIGHT}px)` }, { transform: 'none' }]);

    // d is new: it fades in.
    const d = animate.mock.calls[callFor(container, 'd')]!;
    expect(d[0][0]).toMatchObject({ opacity: 0 });
});

it('fades out rows that left, as hidden copies outside the list', () => {
    const { container, getByTestId, rerender } = render(<List ids={['a', 'b', 'c']} />);
    rerender(<List ids={['a', 'c']} />);

    const ghost = getByTestId('overlay').querySelector('li')!;
    expect(ghost).toHaveTextContent('b');
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
    expect(ghost.style.top).toBe(`${ROW_HEIGHT}px`);
    expect(animate.mock.calls[animate.mock.contexts.indexOf(ghost)]![0]).toEqual([{ opacity: 1 }, { opacity: 0 }]);
    // The real list only contains the current rows.
    expect(container.querySelectorAll('ol > li')).toHaveLength(2);
});

it('does nothing when the user prefers reduced motion', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes('reduce') })) as typeof window.matchMedia;
    try {
        const { rerender } = render(<List ids={['a', 'b']} />);
        rerender(<List ids={['b', 'a']} />);
        expect(animate).not.toHaveBeenCalled();
    } finally {
        window.matchMedia = original;
    }
});
