import { useEffect, useRef, useState } from 'react';
import { SegmentedControl } from '@/components/SegmentedControl';
import { demoTracks } from '@/features/demo/demoSource';
import { MovementBadge } from '@/features/top-items/components/MovementBadge';
import { computeMovement } from '@/features/top-items/movement';
import { useFlipList } from '@/features/top-items/useFlipList';
import { gsap } from '@/lib/motion/gsap';
import { motionAllowed, useMotion, usePointerTilt } from '@/lib/motion/hooks';
import { pickImage } from '@/lib/spotify/images';
import type { Track } from '@/lib/spotify/types';
import styles from './LandingPreview.module.css';

type PreviewRange = 'short_term' | 'medium_term';

const RANGES = {
    short_term: { label: '4 weeks', phrase: 'over the last 4 weeks', compareTo: 'medium_term', against: 'the last 6 months' },
    medium_term: { label: '6 months', phrase: 'over the last 6 months', compareTo: 'long_term', against: 'all time' },
} as const;

const OPTIONS = [
    { value: 'short_term', label: RANGES.short_term.label },
    { value: 'medium_term', label: RANGES.medium_term.label },
] as const;

/** After the entrance, the preview switches range once on its own to show the re-rank. */
const AUTO_DEMO_DELAY_MS = 2600;

/** A real slice of the product, rendered from the fictional demo data. */
export function LandingPreview() {
    const [range, setRange] = useState<PreviewRange>('short_term');
    /** True once the range has changed (automatically or by the visitor). */
    const [switched, setSwitched] = useState(false);
    const figureRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLOListElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const info = RANGES[range];
    const current = demoTracks(range);
    const movements = computeMovement(current, demoTracks(info.compareTo));
    const [top, ...rest] = current.slice(0, 6);
    useFlipList(listRef, overlayRef, rest.map((t) => t.id).join('|'));

    usePointerTilt(figureRef, 3);
    useMotion(
        () => {
            gsap.timeline({ delay: 0.2 })
                .from(figureRef.current, { opacity: 0, y: 32, scale: 0.98, duration: 0.9 })
                .from(`.${styles.topArt}`, { opacity: 0, scale: 0.9, duration: 0.8 }, 0.25)
                // Rows are also re-rank (FLIP) targets: leave no inline styles behind.
                .from(`.${styles.row}`, { opacity: 0, y: 12, duration: 0.6, stagger: 0.05, clearProps: 'opacity,transform' }, 0.3);
        },
        { scope: figureRef },
    );

    // One automatic demonstration, only when motion is welcome, the card is on screen and the
    // visitor hasn't used the switch. After that it changes only when they ask.
    useEffect(() => {
        const figure = figureRef.current;
        if (switched || !figure || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
        let timer: number | undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                window.clearTimeout(timer);
                if (entry?.isIntersecting && document.visibilityState === 'visible') {
                    timer = window.setTimeout(() => {
                        setRange('medium_term');
                        setSwitched(true);
                    }, AUTO_DEMO_DELAY_MS);
                }
            },
            { threshold: 0.6 },
        );
        observer.observe(figure);
        return () => {
            observer.disconnect();
            window.clearTimeout(timer);
        };
    }, [switched]);

    if (!top) return null;

    return (
        <figure ref={figureRef} className={styles.preview} aria-label="Preview of Jossify with fictional demo data">
            <PreviewTop key={top.id} track={top} phrase={info.phrase} animateIn={switched} />
            <SegmentedControl
                className={styles.switch}
                legend="Preview time range"
                options={OPTIONS}
                value={range}
                onChange={(value) => {
                    setSwitched(true);
                    setRange(value);
                }}
            />
            <div className={styles.rowsWrap}>
                <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />
                <ol ref={listRef} className={styles.rows} start={2} aria-hidden="true">
                    {rest.map((track, i) => (
                        <li key={track.id} data-flip-id={track.id} className={styles.row}>
                            <span className={`${styles.num} tabular`}>{i + 2}</span>
                            <MovementBadge movement={movements.get(track.id)} againstLabel={info.against} />
                            <img src={pickImage(track.album.images, 64)} alt="" width={40} height={40} />
                            <span className={styles.rowText}>
                                <span className={styles.rowName}>{track.name}</span>
                                <span className={styles.rowArtist}>{track.artists[0]?.name}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>
            <figcaption className={styles.caption}>Preview · fictional demo data</figcaption>
        </figure>
    );
}

/** Keyed by the #1, so a new #1 cross-fades in. The first one is part of the card's entrance. */
function PreviewTop({ track, phrase, animateIn }: { track: Track; phrase: string; animateIn: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    useMotion(
        () => {
            if (animateIn) gsap.from(ref.current, { opacity: 0, y: 8, duration: 0.35 });
        },
        { scope: ref },
    );

    return (
        <div ref={ref} className={styles.top}>
            <img className={styles.topArt} src={pickImage(track.album.images, 200)} alt="" width={112} height={112} />
            <div className={styles.topText}>
                <p className={styles.topName}>{track.name}</p>
                <p className={styles.topArtist}>{track.artists[0]?.name}</p>
                <p className={styles.topContext}>
                    <span className={styles.rank}>#1</span> {phrase}
                </p>
            </div>
        </div>
    );
}
