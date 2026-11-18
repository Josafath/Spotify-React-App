import { createContext, useContext } from 'react';
import { spotifyGet } from '@/lib/spotify/client';
import type { Paging, TimeRange, TopItem, TopItemType, UserProfile } from '@/lib/spotify/types';

export const TOP_ITEMS_LIMIT = 40;

/**
 * Where top items come from. The UI only talks to this interface, so the same
 * screens render a signed-in user's Spotify data or the offline demo.
 */
export interface MusicSource {
    kind: 'spotify' | 'demo';
    getTopItems<T extends TopItemType>(type: T, range: TimeRange, signal?: AbortSignal): Promise<TopItem<T>[]>;
    getProfile(signal?: AbortSignal): Promise<UserProfile>;
}

export const spotifySource: MusicSource = {
    kind: 'spotify',
    async getTopItems(type, range, signal) {
        const page = await spotifyGet<Paging<TopItem<typeof type>>>(
            `/me/top/${type}?time_range=${range}&limit=${TOP_ITEMS_LIMIT}`,
            { signal },
        );
        return page.items;
    },
    getProfile(signal) {
        return spotifyGet<UserProfile>('/me', { signal });
    },
};

const MusicSourceContext = createContext<MusicSource | null>(null);

export const MusicSourceProvider = MusicSourceContext.Provider;

export function useMusicSource(): MusicSource {
    const source = useContext(MusicSourceContext);
    if (!source) throw new Error('useMusicSource must be used inside a MusicSourceProvider');
    return source;
}
