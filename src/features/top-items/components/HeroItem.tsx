import { ExternalLink } from 'lucide-react';
import { buttonClass } from '@/components/button';
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
}

/** The #1 item at poster scale. */
export function HeroItem({ item, rangePhrase, movement, againstLabel }: HeroItemProps) {
    const image = pickImage(item.images, 600);
    const isArtist = item.kind === 'artist';
    // With a player, Play is the primary action; without one (the demo), opening Spotify is.
    const hasPlayer = usePlayer() !== null;

    return (
        <section className={styles.hero} aria-labelledby="top-item-title">
            <a
                className={`${styles.art} ${isArtist ? styles.round : ''}`}
                href={item.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden="true"
            >
                {image ? <img src={image} alt="" width={320} height={320} /> : null}
            </a>

            <div className={styles.body}>
                <h2 id="top-item-title" className={styles.title}>
                    {item.name}
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
