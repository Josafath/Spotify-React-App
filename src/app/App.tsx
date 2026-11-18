import { Navigate, Route, Routes } from 'react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { DemoTopPage } from '@/features/demo/DemoTopPage';
import { SpotifyTopPage } from '@/features/top-items/SpotifyTopPage';

export function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* Must match the redirect URI registered with Spotify. */}
            <Route path="/TopMusic" element={<SpotifyTopPage />} />
            <Route path="/demo" element={<DemoTopPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
