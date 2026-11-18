import { buttonClass } from '@/components/button';
import { redirectToSpotifyAuth } from '@/lib/spotify/auth';
import { MusicSourceProvider } from '@/features/top-items/musicSource';
import { TopItemsView } from '@/features/top-items/TopItemsView';
import { demoSource } from './demoSource';
import styles from './DemoTopPage.module.css';

/** The same screens as the signed-in app, fed by fictional demo data. */
export function DemoTopPage() {
    const signIn = () => void redirectToSpotifyAuth();

    return (
        <MusicSourceProvider value={demoSource}>
            <TopItemsView
                account={
                    <button type="button" className={buttonClass('primary')} onClick={signIn}>
                        Sign in
                    </button>
                }
                banner={
                    <div className={styles.banner} role="note">
                        <p>
                            <strong>Demo data.</strong> Fictional artists, tracks and covers.
                        </p>
                    </div>
                }
            />
        </MusicSourceProvider>
    );
}
