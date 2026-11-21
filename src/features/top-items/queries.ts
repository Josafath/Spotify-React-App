import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { TimeRange, TopItemType } from '@/lib/spotify/types';
import { useMusicSource } from './musicSource';
import { ITEM_TYPES, TIME_RANGES } from './ranges';

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

type Schedule = (task: () => void) => () => void;

/** Runs a task when the browser is idle (or after a short delay where idle callbacks don't exist). */
const whenIdle: Schedule = (task) => {
    if (typeof window.requestIdleCallback === 'function') {
        const handle = window.requestIdleCallback(task, { timeout: 2000 });
        return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(task, 200);
    return () => window.clearTimeout(handle);
};

/**
 * Once the current view has loaded, fetches every other view in the background: the other
 * ranges of this type first, then the other type. Switching range then never shows a loading
 * skeleton, so the list can always re-rank in place instead of being rebuilt.
 *
 * One request at a time, each in an idle slot, so it never competes with what's on screen.
 * Views already cached are skipped; any failure (rate limit, expired session) stops the run,
 * and the view will simply load normally if the user opens it.
 */
export function usePrefetchViews(type: TopItemType, ready: boolean, schedule: Schedule = whenIdle) {
    const source = useMusicSource();
    const client = useQueryClient();

    useEffect(() => {
        if (!ready) return;
        const types = [type, ...ITEM_TYPES.map((t) => t.id).filter((t) => t !== type)];
        const queue = types.flatMap((t) => TIME_RANGES.map((r) => [t, r.id] as const));
        let cancelled = false;
        let cancelScheduled = () => {};

        const next = (index: number) => {
            if (cancelled || index >= queue.length) return;
            const [t, range] = queue[index]!;
            const queryKey = topItemsKey(source.kind, t, range);
            void client
                .prefetchQuery({
                    queryKey,
                    queryFn: ({ signal }) => source.getTopItems(t, range, signal),
                    staleTime: STALE_TIME,
                })
                .then(() => {
                    if (cancelled || client.getQueryState(queryKey)?.status === 'error') return;
                    cancelScheduled = schedule(() => next(index + 1));
                });
        };

        cancelScheduled = schedule(() => next(0));
        return () => {
            cancelled = true;
            cancelScheduled();
        };
    }, [ready, type, source, client, schedule]);
}

export function useProfile() {
    const source = useMusicSource();
    return useQuery({
        queryKey: [source.kind, 'me'],
        queryFn: ({ signal }) => source.getProfile(signal),
        staleTime: Infinity,
    });
}
