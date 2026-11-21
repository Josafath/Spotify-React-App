import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { SpotifyApiError } from '@/lib/spotify/client';
import type { TimeRange, TopItemType } from '@/lib/spotify/types';
import { MusicSourceProvider, type MusicSource } from './musicSource';
import { topItemsKey, usePrefetchViews } from './queries';

// Run scheduled work on the next tick instead of waiting for an idle browser.
const soon = (task: () => void) => {
    const handle = setTimeout(task, 0);
    return () => clearTimeout(handle);
};

function setup(getTopItems: (type: TopItemType, range: TimeRange) => Promise<never[]>) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const source: MusicSource = {
        kind: 'spotify',
        getTopItems: vi.fn((type, range) => getTopItems(type, range)) as MusicSource['getTopItems'],
        getProfile: vi.fn(),
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>
            <MusicSourceProvider value={source}>{children}</MusicSourceProvider>
        </QueryClientProvider>
    );
    const calls = () => vi.mocked(source.getTopItems).mock.calls.map(([t, r]) => `${t}:${r}`);
    return { client, wrapper, calls };
}

it('waits until the current view is ready', async () => {
    const { wrapper, calls } = setup(async () => []);
    renderHook(() => usePrefetchViews('tracks', false, soon), { wrapper });
    await new Promise((r) => setTimeout(r, 20));
    expect(calls()).toEqual([]);
});

it('loads the other ranges of this type first, then the other type, skipping cached views', async () => {
    const { client, wrapper, calls } = setup(async () => []);
    client.setQueryData(topItemsKey('spotify', 'tracks', 'short_term'), []);
    client.setQueryData(topItemsKey('spotify', 'tracks', 'medium_term'), []);

    renderHook(() => usePrefetchViews('tracks', true, soon), { wrapper });

    await waitFor(() => expect(calls()).toHaveLength(4));
    expect(calls()).toEqual(['tracks:long_term', 'artists:short_term', 'artists:medium_term', 'artists:long_term']);
});

it('stops at the first failure instead of hammering Spotify', async () => {
    const { wrapper, calls } = setup(async (_type, range) => {
        if (range === 'medium_term') throw new SpotifyApiError(429, 'Too many requests');
        return [];
    });

    renderHook(() => usePrefetchViews('artists', true, soon), { wrapper });

    await waitFor(() => expect(calls()).toContain('artists:medium_term'));
    await new Promise((r) => setTimeout(r, 30));
    expect(calls()).toEqual(['artists:short_term', 'artists:medium_term']);
});
