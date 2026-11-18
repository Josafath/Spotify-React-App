import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { redirectToSpotifyAuth } from './auth/spotifyAuth';

vi.mock('./auth/spotifyAuth', () => ({ redirectToSpotifyAuth: vi.fn() }));

test('starts the Spotify login when clicking sign in', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/sign in with spotify/i));
  expect(redirectToSpotifyAuth).toHaveBeenCalledTimes(1);
});
