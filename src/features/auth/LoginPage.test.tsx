import { fireEvent, screen } from '@testing-library/react';
import { hasStoredSession, redirectToSpotifyAuth } from '@/lib/spotify/auth';
import type * as AuthModule from '@/lib/spotify/auth';
import { renderApp } from '@/test/renderApp';

vi.mock('@/lib/spotify/auth', async (importOriginal) => ({
    ...(await importOriginal<typeof AuthModule>()),
    hasStoredSession: vi.fn(() => false),
    redirectToSpotifyAuth: vi.fn(),
}));

it('starts the Spotify sign-in', () => {
    renderApp('/');
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with Spotify' }));
    expect(redirectToSpotifyAuth).toHaveBeenCalledTimes(1);
});

it('offers the demo to people who cannot sign in', () => {
    renderApp('/');
    fireEvent.click(screen.getByRole('link', { name: 'Explore the demo' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/demo');
});

it('lets a returning user skip the sign-in', () => {
    vi.mocked(hasStoredSession).mockReturnValue(true);
    renderApp('/');
    expect(screen.getByRole('link', { name: 'Open your top 40' })).toHaveAttribute('href', '/TopMusic');
    expect(screen.queryByRole('button', { name: 'Sign in with Spotify' })).not.toBeInTheDocument();
});
