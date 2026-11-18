import type { Artist, SpotifyImage, Track } from '@/lib/spotify/types';

/** What the UI needs to render one ranked item, whether it is a track or an artist. */
export interface DisplayItem {
    id: string;
    kind: 'track' | 'artist';
    name: string;
    /** Track: its artists. Artist: its top genres, when Spotify provides them. */
    subtitle: string;
    /** Track: album name. Artist: genres (the desktop detail column; phones show the subtitle instead). */
    detail: string | null;
    images: SpotifyImage[];
    imageAlt: string;
    spotifyUrl: string;
    /** Spotify URI the embed player loads (spotify:track:… or spotify:artist:…). */
    uri: string;
    durationMs: number | null;
    explicit: boolean;
}

export function trackToDisplay(track: Track): DisplayItem {
    return {
        id: track.id,
        kind: 'track',
        name: track.name,
        subtitle: track.artists.map((a) => a.name).join(', '),
        detail: track.album.name,
        images: track.album.images,
        imageAlt: `Cover of ${track.album.name}`,
        spotifyUrl: track.external_urls.spotify,
        uri: track.uri,
        durationMs: track.duration_ms,
        explicit: track.explicit,
    };
}

export function artistToDisplay(artist: Artist): DisplayItem {
    const genres = (artist.genres ?? []).slice(0, 3).join(', ');
    return {
        id: artist.id,
        kind: 'artist',
        name: artist.name,
        subtitle: genres,
        detail: genres || null,
        images: artist.images,
        imageAlt: `Photo of ${artist.name}`,
        spotifyUrl: artist.external_urls.spotify,
        uri: artist.uri,
        durationMs: null,
        explicit: false,
    };
}
