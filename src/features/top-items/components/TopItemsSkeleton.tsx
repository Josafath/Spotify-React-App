import styles from './TopItemsSkeleton.module.css';

/** Mirrors the hero + list layout so nothing jumps when data arrives. */
export function TopItemsSkeleton() {
    return (
        <div className={styles.wrap} aria-busy="true">
            <p className="sr-only" role="status">
                Loading your top items…
            </p>
            <div className={styles.hero} aria-hidden="true">
                <div className={`${styles.block} ${styles.art}`} />
                <div className={styles.lines}>
                    <div className={`${styles.block} ${styles.title}`} />
                    <div className={`${styles.block} ${styles.line}`} />
                    <div className={`${styles.block} ${styles.short}`} />
                </div>
            </div>
            <div className={styles.rows} aria-hidden="true">
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className={styles.row}>
                        <div className={`${styles.block} ${styles.thumb}`} />
                        <div className={styles.lines}>
                            <div className={`${styles.block} ${styles.line}`} />
                            <div className={`${styles.block} ${styles.short}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
