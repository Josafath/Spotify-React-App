import { QueryClient } from '@tanstack/react-query';
import { SpotifyApiError } from '@/lib/spotify/client';

export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                // Retrying can't fix a missing session or a bad request; it can fix a flaky network.
                retry: (failureCount, error) => {
                    if (error instanceof SpotifyApiError && error.status < 500 && !error.isRateLimited) return false;
                    return failureCount < 2;
                },
            },
        },
    });
}
