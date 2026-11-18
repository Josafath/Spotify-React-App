import { useQuery } from '@tanstack/react-query';
import type { TimeRange, TopItemType } from '@/lib/spotify/types';
import { useMusicSource } from './musicSource';

// Spotify recomputes top items roughly daily; no need to refetch on every focus.
const STALE_TIME = 10 * 60 * 1000;

export const topItemsKey = (source: string, type: TopItemType, range: TimeRange | 'none') =>
    [source, 'top', type, range] as const;

/** Top items for one range. Pass `null` for "no range" (e.g. nothing to compare against): the query stays idle. */
export function useTopItems<T extends TopItemType>(type: T, range: TimeRange | null) {
    const source = useMusicSource();
    return useQuery({
        // A separate key for "none", so an idle query never reads another range's cached data.
        queryKey: topItemsKey(source.kind, type, range ?? 'none'),
        queryFn: ({ signal }) => {
            if (!range) throw new Error('useTopItems called without a range');
            return source.getTopItems(type, range, signal);
        },
        enabled: range !== null,
        staleTime: STALE_TIME,
    });
}

export function useProfile() {
    const source = useMusicSource();
    return useQuery({
        queryKey: [source.kind, 'me'],
        queryFn: ({ signal }) => source.getProfile(signal),
        staleTime: Infinity,
    });
}
