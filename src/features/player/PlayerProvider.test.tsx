import { act, fireEvent, render, screen } from '@testing-library/react';
import { PlayButton } from './PlayButton';
import { PlayerProvider } from './PlayerProvider';
import { embedUrl, type EmbedController, type IFrameAPI } from './spotifyEmbed';

type Listener = (e?: { data: { isPaused: boolean } }) => void;

function fakeSpotify() {
    const listeners: Record<string, Listener> = {};
    const controller = {
        loadUri: vi.fn(),
        play: vi.fn(),
        togglePlay: vi.fn(),
        destroy: vi.fn(),
        addListener: vi.fn((event: string, cb: Listener) => {
            listeners[event] = cb;
        }),
    };
    const api = {
        createController: vi.fn((_el: HTMLElement, _opts: { uri: string }, cb: (c: EmbedController) => void) =>
            cb(controller as unknown as EmbedController),
        ),
    };
    return { api, controller, listeners };
}

const songA = { uri: 'spotify:track:a', name: 'Song A', subtitle: 'Artist A' };
const songB = { uri: 'spotify:track:b', name: 'Song B', subtitle: 'Artist B' };

function renderPlayer() {
    return render(
        <PlayerProvider>
            <PlayButton item={songA} />
            <PlayButton item={songB} />
        </PlayerProvider>,
    );
}

// The iFrame API script loads once per page; resolve it with a fake the first time it's requested.
const spotify = fakeSpotify();
const apiReady = async () => {
    await act(async () => {
        window.onSpotifyIframeApiReady?.(spotify.api as unknown as IFrameAPI);
    });
};

beforeEach(() => {
    vi.clearAllMocks();
});

it('docks Spotify’s player with the chosen track and starts it', async () => {
    renderPlayer();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Play Song A' }));
    await apiReady();

    expect(screen.getByRole('region', { name: 'Player: Song A' })).toBeInTheDocument();
    expect(spotify.api.createController).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ uri: 'spotify:track:a' }),
        expect.any(Function),
    );
    expect(document.documentElement).toHaveClass('has-player');

    // Spotify reports it's playing: the button turns into a pause button.
    act(() => spotify.listeners.playback_update?.({ data: { isPaused: false } }));
    expect(screen.getByRole('button', { name: 'Pause Song A' })).toHaveAttribute('aria-pressed', 'true');
});

it('switches tracks in the same player, and toggles when the same track is pressed', async () => {
    renderPlayer();
    fireEvent.click(screen.getByRole('button', { name: 'Play Song A' }));
    await apiReady();

    fireEvent.click(screen.getByRole('button', { name: 'Play Song B' }));
    expect(spotify.controller.loadUri).toHaveBeenCalledWith('spotify:track:b');
    expect(spotify.controller.play).toHaveBeenCalled();
    expect(screen.getByRole('region', { name: 'Player: Song B' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Play Song B' }));
    expect(spotify.controller.togglePlay).toHaveBeenCalledTimes(1);
});

it('closes the player and frees the page bottom', async () => {
    renderPlayer();
    fireEvent.click(screen.getByRole('button', { name: 'Play Song A' }));
    await apiReady();

    fireEvent.click(screen.getByRole('button', { name: 'Close player' }));

    expect(spotify.controller.destroy).toHaveBeenCalled();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('has-player');
});

it('renders no play buttons without a player (the demo)', () => {
    render(<PlayButton item={songA} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('builds the plain embed URL used when the iFrame API is unavailable', () => {
    expect(embedUrl('spotify:track:abc')).toBe('https://open.spotify.com/embed/track/abc?utm_source=jossify');
    expect(embedUrl('spotify:artist:xyz')).toBe('https://open.spotify.com/embed/artist/xyz?utm_source=jossify');
});
