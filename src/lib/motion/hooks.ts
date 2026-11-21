import type { RefObject } from 'react';
import { FINE_POINTER, MOTION_OK, gsap, useGSAP } from './gsap';

type Setup = (context: gsap.Context) => void | (() => void);

interface MotionOptions {
    /** Selector text in `gsap.*` calls resolves inside this element, and everything is cleaned up with it. */
    scope?: RefObject<Element | null>;
    /** Re-run (after reverting) when these change. Defaults to mount only. */
    dependencies?: unknown[];
    /** Optional gentler version for people who prefer reduced motion: opacity only, no movement. */
    reduced?: Setup;
}

const canMatchMedia = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Runs GSAP animations only when motion is welcome, and cleans them up with the component.
 *
 * - Runs in a layout effect, so `gsap.from()` sets the start state before the first paint (no flash).
 * - `gsap.matchMedia` creates the tweens only when `prefers-reduced-motion` allows it, and
 *   reverts them (removing every inline style they set) if the setting changes while open.
 * - Unmounting or a dependency change reverts everything, so nothing leaks or keeps running.
 */
export function useMotion(setup: Setup, { scope, dependencies = [], reduced }: MotionOptions = {}) {
    useGSAP(
        () => {
            if (!canMatchMedia()) return;
            const mm = gsap.matchMedia(scope?.current ?? undefined);
            mm.add(MOTION_OK, setup);
            if (reduced) mm.add('(prefers-reduced-motion: reduce)', reduced);
            return () => mm.revert();
        },
        { scope, dependencies, revertOnUpdate: true },
    );
}

/**
 * A subtle 3D tilt that follows the pointer. Mouse and trackpad only, never on touch,
 * and never under reduced motion.
 *
 * Uses `gsap.quickTo`, which reuses one tween per axis instead of creating one per
 * pointer event, and reads the element's box once per hover instead of on every move.
 */
export function usePointerTilt(ref: RefObject<HTMLElement | null>, maxDegrees = 6) {
    useGSAP(
        () => {
            const el = ref.current;
            if (!el || !canMatchMedia()) return;
            const mm = gsap.matchMedia();
            mm.add(FINE_POINTER, () => {
                gsap.set(el, { transformPerspective: 900 });
                const toX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
                const toY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
                let box: DOMRect | null = null;

                const onMove = (event: PointerEvent) => {
                    box ??= el.getBoundingClientRect();
                    const x = (event.clientX - box.left) / box.width - 0.5;
                    const y = (event.clientY - box.top) / box.height - 0.5;
                    toY(x * maxDegrees * 2);
                    toX(-y * maxDegrees * 2);
                };
                const onLeave = () => {
                    box = null;
                    toX(0);
                    toY(0);
                };
                const onScroll = () => {
                    box = null;
                };

                el.addEventListener('pointermove', onMove, { passive: true });
                el.addEventListener('pointerleave', onLeave, { passive: true });
                window.addEventListener('scroll', onScroll, { passive: true });
                return () => {
                    el.removeEventListener('pointermove', onMove);
                    el.removeEventListener('pointerleave', onLeave);
                    window.removeEventListener('scroll', onScroll);
                };
            });
            return () => mm.revert();
        },
        { scope: ref, dependencies: [maxDegrees] },
    );
}

/** True when the visitor hasn't asked for reduced motion (false in environments without matchMedia). */
export function motionAllowed(): boolean {
    return canMatchMedia() && window.matchMedia(MOTION_OK).matches;
}
