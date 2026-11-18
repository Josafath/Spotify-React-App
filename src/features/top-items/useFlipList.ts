import { useLayoutEffect, useRef, type RefObject } from 'react';

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface RowSnapshot {
    top: number;
    /** A detached copy of the row, used to fade it out if it leaves the list. */
    ghost: HTMLElement;
}

/**
 * FLIP re-ranking: when the order of `[data-flip-id]` children changes, rows that stay
 * slide from their old position to the new one, new rows fade in, and rows that left
 * fade out where they were. Transform and opacity only; skipped under reduced motion.
 *
 * Leaving rows are animated as detached copies inside an overlay next to the list,
 * never inside the React-managed list itself.
 */
export function useFlipList(
    listRef: RefObject<HTMLElement | null>,
    overlayRef: RefObject<HTMLElement | null>,
    orderKey: string,
) {
    const snapshots = useRef(new Map<string, RowSnapshot>());

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        const previous = snapshots.current;
        const next = new Map<string, RowSnapshot>();
        const animate = !reduceMotion && previous.size > 0;

        list.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((row) => {
            const id = row.dataset.flipId!;
            const top = row.offsetTop;
            next.set(id, { top, ghost: row.cloneNode(true) as HTMLElement });
            if (!animate || typeof row.animate !== 'function') return;

            const before = previous.get(id);
            if (before === undefined) {
                row.animate(
                    [
                        { opacity: 0, transform: 'translateY(8px)' },
                        { opacity: 1, transform: 'none' },
                    ],
                    { duration: 360, delay: 160, easing: EASE_OUT, fill: 'backwards' },
                );
            } else if (before.top !== top) {
                row.animate([{ transform: `translateY(${before.top - top}px)` }, { transform: 'none' }], {
                    duration: 560,
                    easing: EASE_OUT,
                });
            }
        });

        const overlay = overlayRef.current;
        if (animate && overlay) {
            previous.forEach(({ top, ghost }, id) => {
                if (next.has(id) || typeof ghost.animate !== 'function') return;
                ghost.removeAttribute('data-flip-id');
                ghost.setAttribute('aria-hidden', 'true');
                ghost.inert = true;
                Object.assign(ghost.style, { position: 'absolute', top: `${top}px`, left: '0', right: '0' });
                overlay.appendChild(ghost);
                const fade = ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-out' });
                fade.onfinish = () => ghost.remove();
                fade.oncancel = () => ghost.remove();
            });
        }

        snapshots.current = next;
    }, [listRef, overlayRef, orderKey]);
}
