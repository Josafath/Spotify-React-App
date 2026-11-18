import { Pause, Play } from 'lucide-react';
import { buttonClass } from '@/components/button';
import { usePlayer, type PlayableItem } from './playerContext';
import styles from './PlayButton.module.css';

interface PlayButtonProps {
    item: PlayableItem;
    /** "icon" for list rows, "labelled" for the hero. */
    variant?: 'icon' | 'labelled';
}

/** Plays an item in the docked Spotify player. Renders nothing where there is no player (the demo). */
export function PlayButton({ item, variant = 'icon' }: PlayButtonProps) {
    const player = usePlayer();
    if (!player) return null;

    const isCurrent = player.current?.uri === item.uri;
    const isPlaying = isCurrent && !player.isPaused;
    const Icon = isPlaying ? Pause : Play;
    const action = isPlaying ? 'Pause' : 'Play';

    if (variant === 'labelled') {
        return (
            <button
                type="button"
                className={buttonClass('primary')}
                onClick={() => player.play(item)}
                aria-pressed={isPlaying}
            >
                <Icon size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                {action}
            </button>
        );
    }

    return (
        <button
            type="button"
            className={`${styles.icon} ${isCurrent ? styles.current : ''}`}
            onClick={() => player.play(item)}
            aria-pressed={isPlaying}
            aria-label={`${action} ${item.name}`}
        >
            <Icon size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        </button>
    );
}
