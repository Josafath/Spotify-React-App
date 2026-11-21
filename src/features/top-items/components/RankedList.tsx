import { useLayoutEffect, useRef } from 'react';
import { Clock3, ExternalLink } from 'lucide-react';
import { gsap } from '@/lib/motion/gsap';
import { useMotion } from '@/lib/motion/hooks';
import { formatDuration, pickImage } from '@/lib/spotify/images';
import type { DisplayItem } from '../displayItem';
import type { Movement } from '../movement';
import { useFlipList } from '../useFlipList';
import { MovementBadge } from './MovementBadge';
import { PlayButton } from '@/features/player/PlayButton';
import styles from './RankedList.module.css';

interface RankedListProps {
    kind: 'track' | 'artist';
    items: DisplayItem[];
    startRank: number;
    movements: Map<string, Movement> | null;
    againstLabel: string;
    label: string;
    /** "full" waits for the hero's poster entrance; "quick" follows a short hand-off. Read once on mount. */
    intro?: 'full' | 'quick';
}

/** Only the rows a first screen can show enter in sequence; the rest are already in place below the fold. */
const INTRO_ROWS = 12;

/** Ranks 2-40 as precise rows, for tracks and artists alike. Re-ranks in place when the range changes. */
export function RankedList({ kind, items, startRank, movements, againstLabel, label, intro = 'quick' }: RankedListProps) {
    const listRef = useRef<HTMLOListElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const introTween = useRef<gsap.core.Tween | null>(null);
    const orderKey = items.map((item) => item.id).join('|');

    // Entrance on mount (a new list: first load or tracks/artists switch). Range changes re-rank instead.
    useMotion(
        () => {
            const rows = gsap.utils.toArray<HTMLElement>('[data-flip-id]').slice(0, INTRO_ROWS);
            introTween.current = gsap.from(rows, {
                opacity: 0,
                y: 16,
                duration: intro === 'full' ? 0.6 : 0.45,
                stagger: intro === 'full' ? 0.035 : 0.025,
                delay: intro === 'full' ? 0.35 : 0.05,
                clearProps: 'opacity,transform',
            });
        },
        { scope: listRef },
    );

    // If the range changes mid-entrance, land the entrance first so it never fights the re-rank.
    // Declared before useFlipList so it runs before the re-rank measures and animates.
    const introKey = useRef(orderKey);
    useLayoutEffect(() => {
        if (orderKey === introKey.current) return;
        const tween = introTween.current;
        if (tween && tween.progress() < 1) tween.progress(1);
    }, [orderKey]);

    useFlipList(listRef, overlayRef, orderKey);
    const isTrack = kind === 'track';

    return (
        <div className={`${styles.wrap} ${isTrack ? styles.tracks : styles.artists}`}>
            <div className={styles.header} aria-hidden="true">
                <span className={styles.rank}>#</span>
                <span />
                <span />
                <span>{isTrack ? 'Title' : 'Artist'}</span>
                <span className={styles.detail}>{isTrack ? 'Album' : 'Genres'}</span>
                <span className={styles.duration}>{isTrack ? <Clock3 size={14} /> : null}</span>
                <span />
            </div>
            <div className={styles.body}>
                {/* Rows that drop out of the ranking fade out here, outside the React-managed list. */}
                <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />
                <ol ref={listRef} className={styles.list} start={startRank} aria-label={label}>
                    {items.map((item, index) => (
                        <RankedRow
                            key={item.id}
                            item={item}
                            rank={startRank + index}
                            round={!isTrack}
                            movement={movements ? movements.get(item.id) : null}
                            againstLabel={againstLabel}
                        />
                    ))}
                </ol>
            </div>
        </div>
    );
}

interface RankedRowProps {
    item: DisplayItem;
    rank: number;
    round: boolean;
    /** null: this range has nothing to compare against, so the column stays empty. */
    movement: Movement | undefined | null;
    againstLabel: string;
}

function RankedRow({ item, rank, round, movement, againstLabel }: RankedRowProps) {
    const image = pickImage(item.images, 64);

    return (
        <li data-flip-id={item.id} className={styles.row}>
            <span className={`${styles.rank} tabular`} aria-hidden="true">
                {rank}
            </span>
            <span className={styles.movement}>
                {movement !== null ? <MovementBadge movement={movement} againstLabel={againstLabel} /> : null}
            </span>
            <span className={`${styles.art} ${round ? styles.round : ''}`}>
                {image ? <img src={image} alt="" width={48} height={48} loading="lazy" /> : null}
            </span>
            <span className={styles.main}>
                <a className={styles.name} href={item.spotifyUrl} target="_blank" rel="noreferrer">
                    <span className="sr-only">{`Number ${rank}: `}</span>
                    {item.name}
                </a>
                {item.subtitle ? (
                    <span className={styles.subtitle}>
                        {item.explicit ? (
                            <abbr className={styles.explicit} title="Explicit">
                                E
                            </abbr>
                        ) : null}
                        {item.subtitle}
                    </span>
                ) : null}
            </span>
            <span className={styles.detail}>{item.detail}</span>
            <span className={`${styles.duration} tabular`}>
                {item.durationMs !== null ? formatDuration(item.durationMs) : null}
            </span>
            <span className={styles.actions}>
                <PlayButton item={{ uri: item.uri, name: item.name, subtitle: item.subtitle }} />
                <a
                    className={styles.open}
                    href={item.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${item.name} in Spotify`}
                >
                    <ExternalLink size={16} aria-hidden="true" />
                </a>
            </span>
        </li>
    );
}
