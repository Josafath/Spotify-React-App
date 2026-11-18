import { createContext, useContext } from 'react';

export interface PlayableItem {
    uri: string;
    name: string;
    subtitle: string;
}

export interface PlayerState {
    current: PlayableItem | null;
    /** True until Spotify reports playback, and whenever the user pauses. */
    isPaused: boolean;
    /** Plays the item, or toggles play/pause if it's already loaded. */
    play: (item: PlayableItem) => void;
    close: () => void;
}

export const PlayerContext = createContext<PlayerState | null>(null);

/** The player, or null where there is none (the demo has nothing real to play). */
export function usePlayer(): PlayerState | null {
    return useContext(PlayerContext);
}
