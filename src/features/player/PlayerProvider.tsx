import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { PlayerContext, type PlayableItem, type PlayerState } from './playerContext';
import { embedUrl, loadIframeApi, type EmbedController } from './spotifyEmbed';
import styles from './PlayerBar.module.css';

const EMBED_HEIGHT = 80;

/**
 * Provides playback through Spotify's official embedded player, docked at the bottom
 * of the page. Listeners logged into Spotify in this browser hear full tracks; others
 * hear Spotify's preview.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
    const [current, setCurrent] = useState<PlayableItem | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [useFallback, setUseFallback] = useState(false);

    const hostRef = useRef<HTMLDivElement>(null);
    const controllerRef = useRef<EmbedController | null>(null);
    const creatingRef = useRef(false);
    const latestUriRef = useRef<string | null>(null);

    const uri = current?.uri ?? null;
    latestUriRef.current = uri;

    useEffect(() => {
        if (!uri || useFallback) return;

        const controller = controllerRef.current;
        if (controller) {
            controller.loadUri(uri);
            controller.play();
            return;
        }
        if (creatingRef.current) return; // The controller being created picks up latestUriRef.

        creatingRef.current = true;
        loadIframeApi()
            .then((api) => {
                const host = hostRef.current;
                if (!host) {
                    creatingRef.current = false;
                    return;
                }
                // The API replaces this element with its iframe, so React never owns it.
                const target = document.createElement('div');
                host.appendChild(target);
                api.createController(target, { uri, width: '100%', height: EMBED_HEIGHT }, (created) => {
                    controllerRef.current = created;
                    creatingRef.current = false;
                    created.addListener('playback_update', (e) => setIsPaused(e.data.isPaused));
                    created.addListener('ready', () => created.play());
                    // The user may have picked another track while the player was loading.
                    if (latestUriRef.current && latestUriRef.current !== uri) created.loadUri(latestUriRef.current);
                });
            })
            .catch(() => {
                creatingRef.current = false;
                setUseFallback(true);
            });
    }, [uri, useFallback]);

    // Leave room at the bottom of the page so the docked player never covers content.
    useEffect(() => {
        document.documentElement.classList.toggle('has-player', Boolean(current));
        return () => document.documentElement.classList.remove('has-player');
    }, [current]);

    // Tear the player down when leaving the signed-in screen.
    useEffect(
        () => () => {
            controllerRef.current?.destroy();
            controllerRef.current = null;
        },
        [],
    );

    const play = useCallback(
        (item: PlayableItem) => {
            if (item.uri === uri && controllerRef.current) {
                controllerRef.current.togglePlay();
                return;
            }
            setIsPaused(true);
            setCurrent(item);
        },
        [uri],
    );

    const close = useCallback(() => {
        controllerRef.current?.destroy();
        controllerRef.current = null;
        setCurrent(null);
        setIsPaused(true);
    }, []);

    const value = useMemo<PlayerState>(() => ({ current, isPaused, play, close }), [current, isPaused, play, close]);

    return (
        <PlayerContext.Provider value={value}>
            {children}
            {current ? (
                <section className={styles.bar} aria-label={`Player: ${current.name}`}>
                    <div className={styles.inner}>
                        <div className={styles.embed}>
                            {useFallback ? (
                                <iframe
                                    key={current.uri}
                                    title={`Spotify player: ${current.name}`}
                                    src={embedUrl(current.uri)}
                                    width="100%"
                                    height={EMBED_HEIGHT}
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                />
                            ) : (
                                <div ref={hostRef} className={styles.host} data-testid="spotify-embed-host" />
                            )}
                        </div>
                        <button type="button" className={styles.close} onClick={close} aria-label="Close player">
                            <X size={18} aria-hidden="true" />
                        </button>
                    </div>
                </section>
            ) : null}
        </PlayerContext.Provider>
    );
}
