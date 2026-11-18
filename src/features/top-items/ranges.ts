import type { TimeRange, TopItemType } from '@/lib/spotify/types';

export interface RangeInfo {
    id: TimeRange;
    /** Control label. */
    label: string;
    /** Used after a verb: "your most played track over the last 4 weeks". */
    phrase: string;
    /** Used as a noun: "compared with the last 6 months". */
    name: string;
    /** The longer range this one is compared against to show movement. */
    compareTo: TimeRange | null;
}

export const TIME_RANGES: readonly RangeInfo[] = [
    { id: 'short_term', label: '4 weeks', phrase: 'over the last 4 weeks', name: 'the last 4 weeks', compareTo: 'medium_term' },
    { id: 'medium_term', label: '6 months', phrase: 'over the last 6 months', name: 'the last 6 months', compareTo: 'long_term' },
    { id: 'long_term', label: 'All time', phrase: 'of all time', name: 'all time', compareTo: null },
];

export const ITEM_TYPES: readonly { id: TopItemType; label: string }[] = [
    { id: 'tracks', label: 'Tracks' },
    { id: 'artists', label: 'Artists' },
];

export const DEFAULT_RANGE: TimeRange = 'short_term';
export const DEFAULT_TYPE: TopItemType = 'tracks';

export function getRange(id: TimeRange): RangeInfo {
    const range = TIME_RANGES.find((r) => r.id === id);
    if (!range) throw new Error(`Unknown time range: ${id}`);
    return range;
}

export function parseRange(value: string | null): TimeRange {
    return TIME_RANGES.some((r) => r.id === value) ? (value as TimeRange) : DEFAULT_RANGE;
}

export function parseType(value: string | null): TopItemType {
    return value === 'artists' || value === 'tracks' ? value : DEFAULT_TYPE;
}
