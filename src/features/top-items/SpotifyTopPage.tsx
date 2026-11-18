import { Link, Navigate, useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { buttonClass } from '@/components/button';
import { StateMessage } from '@/components/StateMessage';
import { PlayerProvider } from '@/features/player/PlayerProvider';
import { getAccessToken, logout, redirectToSpotifyAuth } from '@/lib/spotify/auth';
import { AccountMenu } from './components/AccountMenu';
import { MusicSourceProvider, spotifySource } from './musicSource';
import { useProfile } from './queries';
import { TopItemsView } from './TopItemsView';
import styles from './SpotifyTopPage.module.css';

/**
 * The Spotify redirect lands here (/TopMusic, the URI registered with Spotify).
 * Resolves the session first, exchanging the auth code when present.
 */
export function SpotifyTopPage() {
    const session = useQuery({
        queryKey: ['session'],
        queryFn: getAccessToken,
        staleTime: Infinity,
        retry: false,
    });

    if (session.isPending) return <div className={styles.blank} aria-busy="true" />;

    if (session.isError) {
        return (
            <main className={styles.center}>
                <StateMessage
                    tone="error"
                    title="Sign-in didn’t finish"
                    actions={
                        <>
                            <button type="button" className={buttonClass('primary')} onClick={() => void redirectToSpotifyAuth()}>
                                Try again
                            </button>
                            <Link className={buttonClass('ghost')} to="/">
                                Back to start
                            </Link>
                        </>
                    }
                >
                    <p>{session.error.message}</p>
                </StateMessage>
            </main>
        );
    }

    if (!session.data) return <Navigate to="/" replace />;

    return (
        <MusicSourceProvider value={spotifySource}>
            <SignedInView />
        </MusicSourceProvider>
    );
}

function SignedInView() {
    const profile = useProfile();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const signOut = () => {
        logout();
        queryClient.clear();
        navigate('/', { replace: true });
    };

    return (
        <PlayerProvider>
            <TopItemsView account={<AccountMenu profile={profile.data} onSignOut={signOut} />} />
        </PlayerProvider>
    );
}
