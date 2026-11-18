# Spotify-React-App
Simple App using the Spotify API to watch the top tracks and artists your account.

# Link
https://jossify-joss.web.app/

# Development

Requires Node 20.19+ (or 22.12+).

```sh
npm install
npm run dev       # http://127.0.0.1:3000
npm test          # Vitest, single run (npm run test:watch to watch)
npm run build     # production build in ./build
npm run preview   # serve the production build locally
```

## Spotify setup

Sign-in uses the Authorization Code flow with PKCE (`src/auth/spotifyAuth.js`).
In the Spotify Developer Dashboard, register these Redirect URIs exactly:

- `https://jossify-joss.web.app/TopMusic`
- `http://127.0.0.1:3000/TopMusic` (Spotify does not accept `localhost`, so open the app on `127.0.0.1`)

Optional overrides in a `.env.local` file:

```sh
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/TopMusic
```
