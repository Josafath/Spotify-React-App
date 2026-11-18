import { demoTracks } from '@/features/demo/demoSource';
import { MovementBadge } from '@/features/top-items/components/MovementBadge';
import { computeMovement } from '@/features/top-items/movement';
import { pickImage } from '@/lib/spotify/images';
import styles from './LandingPreview.module.css';

/** A real slice of the product, rendered from the fictional demo data. */
export function LandingPreview() {
    const current = demoTracks('short_term');
    const movements = computeMovement(current, demoTracks('medium_term'));
    const [top, ...rest] = current.slice(0, 6);
    if (!top) return null;

    return (
        <figure className={styles.preview} aria-label="Preview of Jossify with fictional demo data">
            <div className={styles.top}>
                <img className={styles.topArt} src={pickImage(top.album.images, 200)} alt="" width={112} height={112} />
                <div className={styles.topText}>
                    <p className={styles.topName}>{top.name}</p>
                    <p className={styles.topArtist}>{top.artists[0]?.name}</p>
                    <p className={styles.topContext}>
                        <span className={styles.rank}>#1</span> over the last 4 weeks
                    </p>
                </div>
            </div>
            <ol className={styles.rows} start={2} aria-hidden="true">
                {rest.map((track, i) => (
                    <li key={track.id} className={styles.row}>
                        <span className={`${styles.num} tabular`}>{i + 2}</span>
                        <MovementBadge movement={movements.get(track.id)} againstLabel="the last 6 months" />
                        <img src={pickImage(track.album.images, 64)} alt="" width={40} height={40} />
                        <span className={styles.rowText}>
                            <span className={styles.rowName}>{track.name}</span>
                            <span className={styles.rowArtist}>{track.artists[0]?.name}</span>
                        </span>
                    </li>
                ))}
            </ol>
            <figcaption className={styles.caption}>Preview · fictional demo data</figcaption>
        </figure>
    );
}
