// The subset of the Spotify Web API that Jossify reads.
// https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
export type TopItemType = 'tracks' | 'artists';

export interface SpotifyImage {
    url: string;
    width: number | null;
    height: number | null;
}

export interface ExternalUrls {
    spotify: string;
}

export interface SimplifiedArtist {
    id: string;
    name: string;
    /** e.g. "spotify:artist:0OdUWJ0sBjDrqHygGUXeCF"; what the embed player loads. */
    uri: string;
    external_urls: ExternalUrls;
}

export interface Artist extends SimplifiedArtist {
    images: SpotifyImage[];
    // Spotify has been trimming these fields for some apps; treat them as optional.
    genres?: string[];
    followers?: { total: number };
}

export interface Album {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date?: string;
}

export interface Track {
    id: string;
    name: string;
    /** e.g. "spotify:track:11dFghVXANMlKmJXsNCbNl"; what the embed player loads. */
    uri: string;
    duration_ms: number;
    explicit: boolean;
    /** Spotify returns null here for apps created after November 2024; playback uses the embed instead. */
    preview_url: string | null;
    external_urls: ExternalUrls;
    artists: SimplifiedArtist[];
    album: Album;
}

export interface Paging<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}

export interface UserProfile {
    id: string;
    display_name: string | null;
    images: SpotifyImage[];
    external_urls: ExternalUrls;
}

export type TopItem<T extends TopItemType> = T extends 'tracks' ? Track : Artist;
