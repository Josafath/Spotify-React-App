import { useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { buttonClass } from '@/components/button';
import { gsap } from '@/lib/motion/gsap';
import { useMotion, usePointerTilt } from '@/lib/motion/hooks';
import { SplitWords } from '@/lib/motion/SplitWords';
import { wordClass } from '@/lib/motion/wordClass';
import { pickImage } from '@/lib/spotify/images';
import type { DisplayItem } from '../displayItem';
import type { Movement } from '../movement';
import { MovementBadge } from './MovementBadge';
import { PlayButton } from '@/features/player/PlayButton';
import { usePlayer } from '@/features/player/playerContext';
import styles from './HeroItem.module.css';

interface HeroItemProps {
    item: DisplayItem;
    rangePhrase: string;
    movement: Movement | undefined;
    againstLabel: string;
    /**
     * "full": the poster entrance, played the first time the ranking appears.
     * "quick": a short hand-off when the #1 changes after that (the element is keyed by item).
     * Read once on mount.
     */
    intro?: 'full' | 'quick';
}

/** Longest the reveal waits for a slow cover before playing over the placeholder anyway. */
const IMAGE_WAIT_MS = 700;

/**
 * The #1's signature reveal. A track's cover rises into its frame like a sleeve pulled from
 * a crate; an artist's portrait opens as an iris. Both settle from a slight zoom, then a
 * single band of light crosses the artwork. Returns a cleanup for useMotion.
 */
function revealArtwork(hero: HTMLElement | null, isArtist: boolean): () => void {
    const img = hero?.querySelector<HTMLImageElement>(`.${styles.art} img`);
    const sheen = hero?.querySelector<HTMLElement>(`.${styles.sheen}`);
    if (!img || !sheen) return () => {};

    const [hidden, shown] = isArtist
        ? ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)']
        : ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'];
    // Clip-path stays on the image, never the frame, so the record shadow is never cut off.
    const reveal = gsap
        .timeline({ paused: true })
        .fromTo(
            img,
            { clipPath: hidden, scale: 1.25 },
            // Gentler than the default expo.out so the reveal reads as a gesture, not a pop.
            { clipPath: shown, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.15, clearProps: 'clipPath,transform' },
        )
        .fromTo(
            sheen,
            { xPercent: -100, opacity: 1 },
            { xPercent: 100, duration: 1, ease: 'power2.inOut', clearProps: 'opacity,transform' },
            0.75,
        );

    let alive = true;
    const loaded = img.complete
        ? Promise.resolve()
        : Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, IMAGE_WAIT_MS))]);
    void loaded.then(() => {
        if (alive) reveal.play();
    });
    return () => {
        alive = false;
    };
}

/** The #1 item at poster scale. */
export function HeroItem({ item, rangePhrase, movement, againstLabel, intro = 'quick' }: HeroItemProps) {
    const image = pickImage(item.images, 600);
    const isArtist = item.kind === 'artist';
    // With a player, Play is the primary action; without one (the demo), opening Spotify is.
    const hasPlayer = usePlayer() !== null;
    const heroRef = useRef<HTMLElement>(null);
    const artRef = useRef<HTMLAnchorElement>(null);

    usePointerTilt(artRef, 5);
    useMotion(
        () => {
            const art = `.${styles.art}`;
            const words = `.${wordClass}`;
            const rest = [`.${styles.subtitle}`, `.${styles.context}`, `.${styles.actions} > *`];
            const tl = gsap.timeline();
            if (intro === 'full') {
                // The frame and text start at once; the picture reveal waits for the image (see below).
                tl.from(art, { opacity: 0, scale: 0.94, y: 24, duration: 0.9 })
                    // 130%: clear of the mask's descender padding, so no sliver shows before the rise.
                    .from(words, { yPercent: 130, duration: 0.8, stagger: 0.05 }, 0.1)
                    .from(rest, { opacity: 0, y: 12, duration: 0.6, stagger: 0.06 }, 0.3)
                    // The ember "#1" lands last, with a small overshoot: the one playful beat.
                    .from(`.${styles.rank}`, { opacity: 0, scale: 0.4, duration: 0.7, ease: 'back.out(1.6)' }, 0.55);
                return revealArtwork(heroRef.current, isArtist);
            } else {
                tl.from(art, { opacity: 0.4, scale: 0.98, duration: 0.3 })
                    .from(words, { opacity: 0, yPercent: 40, duration: 0.35, stagger: 0.015 }, 0)
                    .from(rest, { opacity: 0.4, duration: 0.28 }, 0);
            }
        },
        {
            scope: heroRef,
            // Reduced motion: keep the cross-fade that marks "the #1 changed", drop the movement.
            reduced: () => {
                gsap.from(heroRef.current, { opacity: 0.4, duration: 0.28 });
            },
        },
    );

    return (
        <section ref={heroRef} className={styles.hero} aria-labelledby="top-item-title">
            <a
                ref={artRef}
                className={`${styles.art} ${isArtist ? styles.round : ''}`}
                href={item.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden="true"
            >
                {/* The largest thing on screen (LCP) and the subject of the reveal: fetch it first. */}
                {image ? <img src={image} alt="" width={320} height={320} fetchPriority="high" /> : null}
                <span className={styles.sheen} />
            </a>

            <div className={styles.body}>
                <h2 id="top-item-title" className={styles.title}>
                    <SplitWords text={item.name} />
                </h2>
                {item.subtitle ? <p className={styles.subtitle}>{item.subtitle}</p> : null}
                <p className={styles.context}>
                    <span className={styles.rank}>#1</span>
                    Your most played {isArtist ? 'artist' : 'track'} {rangePhrase}
                    <MovementBadge movement={movement} againstLabel={againstLabel} />
                </p>
            </div>
            <div className={styles.actions}>
                <PlayButton item={{ uri: item.uri, name: item.name, subtitle: item.subtitle }} variant="labelled" />
                <a
                    className={buttonClass(hasPlayer ? 'ghost' : 'primary')}
                    href={item.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Open in Spotify
                    <ExternalLink size={16} aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}
