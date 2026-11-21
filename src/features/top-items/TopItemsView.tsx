import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { RotateCw } from 'lucide-react';
import { buttonClass } from '@/components/button';
import { SiteFooter } from '@/components/SiteFooter';
import { StateMessage } from '@/components/StateMessage';
import { redirectToSpotifyAuth } from '@/lib/spotify/auth';
import { SpotifyApiError } from '@/lib/spotify/client';
import { pickImage } from '@/lib/spotify/images';
import type { Artist, TimeRange, TopItemType, Track } from '@/lib/spotify/types';
import { HeroItem } from './components/HeroItem';
import { RankedList } from './components/RankedList';
import { TopBar } from './components/TopBar';
import { TopItemsSkeleton } from './components/TopItemsSkeleton';
import { artistToDisplay, trackToDisplay, type DisplayItem } from './displayItem';
import { computeMovement } from './movement';
import { usePrefetchViews, useTopItems } from './queries';
import { getRange, parseRange, parseType } from './ranges';
import { useArtworkTint } from './useArtworkTint';
import styles from './TopItemsView.module.css';

interface TopItemsViewProps {
    account: ReactNode;
    banner?: ReactNode;
}

function toDisplay(type: TopItemType, data: (Track | Artist)[]): DisplayItem[] {
    return type === 'tracks'
        ? (data as Track[]).map(trackToDisplay)
        : (data as Artist[]).map(artistToDisplay);
}

/** The signed-in (or demo) screen: pick a type and range, see the ranking and how it moved. */
export function TopItemsView({ account, banner }: TopItemsViewProps) {
    const [params, setParams] = useSearchParams();
    const type = parseType(params.get('type'));
    const range = parseRange(params.get('range'));
    const rangeInfo = getRange(range);
    const compareInfo = rangeInfo.compareTo ? getRange(rangeInfo.compareTo) : null;

    const current = useTopItems(type, range);
    const previous = useTopItems(type, rangeInfo.compareTo);
    // When what's on screen has settled, quietly load the other views so switching is instant.
    usePrefetchViews(type, current.isSuccess && !previous.isFetching);

    const items = useMemo(() => (current.data ? toDisplay(type, current.data) : []), [type, current.data]);
    const hasComparison = rangeInfo.compareTo !== null;
    const movements = useMemo(
        () =>
            hasComparison && current.data && previous.data ? computeMovement(current.data, previous.data) : null,
        [hasComparison, current.data, previous.data],
    );

    const update = (next: { type?: TopItemType; range?: TimeRange }) => {
        setParams(
            (prev) => {
                const out = new URLSearchParams(prev);
                if (next.type) out.set('type', next.type);
                if (next.range) out.set('range', next.range);
                return out;
            },
            { replace: true },
        );
    };

    const noun = type === 'tracks' ? 'tracks' : 'artists';
    const againstLabel = compareInfo?.name ?? '';
    const [top, ...rest] = items;
    const tint = useArtworkTint(pickImage(top?.images, 64));

    // The #1 reveal plays the first time each view (type + range) shows its #1 in a visit: 4 weeks,
    // 6 months and all time, for tracks and for artists. Coming back to a view already seen uses the
    // short hand-off. Keyed by view as well as item, so the reveal plays even when two ranges share a #1.
    const view = `${type}:${range}`;
    const [introduced, setIntroduced] = useState<ReadonlySet<string>>(() => new Set());
    const hasTop = top !== undefined;
    const intro = introduced.has(view) ? 'quick' : 'full';
    useEffect(() => {
        if (hasTop && !introduced.has(view)) setIntroduced((prev) => new Set(prev).add(view));
    }, [hasTop, view, introduced]);

    let content: ReactNode;
    if (current.isPending) {
        content = <TopItemsSkeleton />;
    } else if (current.isError) {
        content = <LoadError error={current.error} onRetry={() => current.refetch()} />;
    } else if (!top) {
        content = (
            <StateMessage
                title="Not enough listening yet"
                actions={
                    range !== 'long_term' ? (
                        <button type="button" className={buttonClass('ghost')} onClick={() => update({ range: 'long_term' })}>
                            Show all time
                        </button>
                    ) : null
                }
            >
                <p>
                    Spotify hasn’t built a list of top {noun} for {rangeInfo.name} yet. It needs a few more days of
                    listening.
                </p>
            </StateMessage>
        );
    } else {
        content = (
            <>
                <HeroItem
                    key={`${view}:${top.id}`}
                    item={top}
                    rangePhrase={rangeInfo.phrase}
                    movement={movements?.get(top.id)}
                    againstLabel={againstLabel}
                    intro={intro}
                />
                {rest.length > 0 ? (
                    <section aria-labelledby="ranking-title">
                        <div className={styles.listHeader}>
                            <h2 id="ranking-title" className={styles.listTitle}>
                                Your top {items.length}
                            </h2>
                            {compareInfo ? (
                                <p className={styles.listNote}>Arrows compare with {compareInfo.name}</p>
                            ) : null}
                        </div>
                        {/* Keyed by type: switching tracks/artists is a new list; switching range re-ranks in place. */}
                        <RankedList
                            key={type}
                            kind={type === 'tracks' ? 'track' : 'artist'}
                            items={rest}
                            startRank={2}
                            movements={movements}
                            againstLabel={againstLabel}
                            label={`Top ${noun} 2 to ${items.length}`}
                            intro={intro}
                        />
                    </section>
                ) : null}
            </>
        );
    }

    return (
        <div className={styles.page}>
            <TopBar
                type={type}
                range={range}
                onTypeChange={(t) => update({ type: t })}
                onRangeChange={(r) => update({ range: r })}
                account={account}
            />
            {banner}
            <div className={styles.body}>
                <div
                    className={styles.wash}
                    style={tint ? ({ '--wash': tint } as CSSProperties) : undefined}
                    aria-hidden="true"
                />
                <main className={styles.main}>
                    <h1 className="sr-only">
                        Your top {noun} {rangeInfo.phrase}
                    </h1>
                    {content}
                </main>
            </div>
            <SiteFooter />
        </div>
    );
}

function LoadError({ error, onRetry }: { error: Error; onRetry: () => void }) {
    if (error instanceof SpotifyApiError && error.isAuthError) {
        return (
            <StateMessage
                tone="error"
                title="Your Spotify session ended"
                actions={
                    <button type="button" className={buttonClass('primary')} onClick={() => void redirectToSpotifyAuth()}>
                        Sign in again
                    </button>
                }
            >
                <p>Sign in again to keep browsing your top items.</p>
            </StateMessage>
        );
    }

    const message =
        error instanceof SpotifyApiError && error.isRateLimited
            ? 'Spotify is limiting requests right now. Wait a minute and try again.'
            : `Spotify didn’t respond as expected (${error.message}). Check your connection and try again.`;

    return (
        <StateMessage
            tone="error"
            title="Couldn’t load your top items"
            actions={
                <button type="button" className={buttonClass('ghost')} onClick={onRetry}>
                    <RotateCw size={16} aria-hidden="true" />
                    Try again
                </button>
            }
        >
            <p>{message}</p>
        </StateMessage>
    );
}
