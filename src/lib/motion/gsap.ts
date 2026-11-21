import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * The one place GSAP is configured. Import `gsap` and `useGSAP` from here, never from
 * the packages directly, so plugins are registered once and every tween shares the
 * same defaults.
 *
 * Only the core is used (no ScrollTrigger, no SplitText) to keep the bundle small.
 */
gsap.registerPlugin(useGSAP);

/** `expo.out` is cubic-bezier(0.16, 1, 0.3, 1): the same curve as the `--ease-out` token. */
export const EASE_OUT = 'expo.out';

gsap.defaults({ ease: EASE_OUT, duration: 0.5 });

/** Media conditions for gsap.matchMedia(). Animations only exist when these match. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const FINE_POINTER = '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)';

export { gsap, useGSAP };
