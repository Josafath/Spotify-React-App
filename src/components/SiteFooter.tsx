import spotifyLogo from '@/assets/spotify-logo-green.png';
import styles from './SiteFooter.module.css';

const REPO_URL = 'https://github.com/Josafath/Spotify-React-App';

export function SiteFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <a className={styles.attribution} href="https://www.spotify.com" target="_blank" rel="noreferrer">
                    <span>Music data and artwork from</span>
                    <img src={spotifyLogo} alt="Spotify" width={84} height={25} />
                </a>
                <p className={styles.note}>Jossify is an independent project and is not affiliated with Spotify.</p>
                <a className={styles.link} href={REPO_URL} target="_blank" rel="noreferrer">
                    Source on GitHub
                </a>
            </div>
        </footer>
    );
}
