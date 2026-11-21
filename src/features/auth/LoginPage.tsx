import { useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from '@/lib/motion/gsap';
import { useMotion } from '@/lib/motion/hooks';
import { SplitWords } from '@/lib/motion/SplitWords';
import { wordClass } from '@/lib/motion/wordClass';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import spotifyIcon from '@/assets/spotify-icon-green.png';
import { buttonClass } from '@/components/button';
import { SiteFooter } from '@/components/SiteFooter';
import { hasStoredSession, redirectToSpotifyAuth } from '@/lib/spotify/auth';
import { LandingPreview } from './LandingPreview';
import styles from './LoginPage.module.css';

export function LoginPage() {
    const signedIn = hasStoredSession();
    const pageRef = useRef<HTMLDivElement>(null);

    // First impression: the headline rises word by word, then the copy and actions follow.
    useMotion(
        () => {
            gsap.timeline()
                .from(`.${styles.brand}`, { opacity: 0, y: -8, duration: 0.6 })
                .from(`.${styles.title} .${wordClass}`, { yPercent: 130, duration: 0.9, stagger: 0.07 }, 0.05)
                .from(
                    [`.${styles.lead}`, `.${styles.actions} > *`, `.${styles.facts}`],
                    { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 },
                    0.3,
                );
        },
        { scope: pageRef },
    );

    return (
        <div ref={pageRef} className={styles.page}>
            <header className={styles.header}>
                <span className={styles.brand}>
                    <BrandMark size={32} />
                    Jossify
                </span>
            </header>

            <main className={styles.main}>
                <section className={styles.intro} aria-labelledby="landing-title">
                    <h1 id="landing-title" className={styles.title}>
                        <SplitWords text="Your listening, ranked." />
                    </h1>
                    <p className={styles.lead}>
                        Your top 40 tracks and artists from the last 4 weeks, the last 6 months and all time, and how
                        they move between them.
                    </p>

                    <div className={styles.actions}>
                        {signedIn ? (
                            <Link to="/TopMusic" className={buttonClass('primary', { large: true })}>
                                Open your top 40
                                <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className={buttonClass('primary', { large: true })}
                                onClick={() => void redirectToSpotifyAuth()}
                            >
                                <img src={spotifyIcon} alt="" width={22} height={22} />
                                Sign in with Spotify
                            </button>
                        )}
                        <Link to="/demo" className={buttonClass('ghost', { large: true })}>
                            Explore the demo
                        </Link>
                    </div>

                    <ul className={styles.facts}>
                        <li>Read-only access to your top items. Nothing is stored outside this browser.</li>
                        <li>
                            While Jossify is in Spotify’s development mode, only approved accounts can sign in. The demo
                            works for everyone.
                        </li>
                    </ul>
                </section>

                <LandingPreview />
            </main>

            <SiteFooter />
        </div>
    );
}
