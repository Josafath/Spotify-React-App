import './Songs.css'
import Logo from './images/Spotify_Logo_RGB_Green.png'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import ArtistList from './components/Artists/ArtistList';
import TrackList from './components/Tracks/TrackList';
import { getAccessToken } from './auth/spotifyAuth';
import axios from 'axios'

const TIME_RANGES = [
    { key: 'long_term', label: 'All Time' },
    { key: 'medium_term', label: 'Last 6 Months' },
    { key: 'short_term', label: 'Last Month' },
];

const EMPTY_TOP = { long_term: [], medium_term: [], short_term: [] };

const fetchTop = (type, range, token) =>
    axios
        .get(`https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=40`, {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then((res) => res.data.items);

// Fetches every time range for one type ('tracks' | 'artists') in parallel.
const fetchAllRanges = async (type, token) => {
    const results = await Promise.all(TIME_RANGES.map(({ key }) => fetchTop(type, key, token)));
    return Object.fromEntries(TIME_RANGES.map(({ key }, i) => [key, results[i]]));
};

export default function Songs(props) {
    const { history } = props;
    const [error, setError] = useState(null);
    const [section, setSection] = useState(null); // 'artists' | 'tracks' | null

    const [tracks, setTracks] = useState(EMPTY_TOP);
    const [artists, setArtists] = useState(EMPTY_TOP);

    useEffect(()=>{
        let cancelled = false;
        const load = async () => {
            try {
                const token = await getAccessToken();
                if (!token) {
                    history.replace('/');
                    return;
                }
                const [topTracks, topArtists] = await Promise.all([
                    fetchAllRanges('tracks', token),
                    fetchAllRanges('artists', token),
                ]);
                if (cancelled) return;
                setTracks(topTracks);
                setArtists(topArtists);
            } catch (err) {
                if (!cancelled) setError(err.message);
            }
        };
        load();
        return () => { cancelled = true; };
    },[history])

    if (error) {
        return (
            <div className="container">
                <img className= "Logo" src={Logo} alt="Spotify Logo" />
                <p>{error}</p>
                <Link to="/">Volver a iniciar sesión</Link>
            </div>
        )
    }
    return(
        <div>
        <div className="container">
            <img className= "Logo" src={Logo} alt="Spotify Logo" />
            <div className="box">
                <div id="top_artists" >
                    <input type="submit" value="Top Artists" onClick={() => setSection('artists')} />
                </div>
                <div id="top_tracks">
                    <input type="submit" value="Top Tracks" onClick={() => setSection('tracks')} />
                </div>
            </div>
            {section === 'artists' ? (
                <TopSection className="elements_tracks" data={artists} render={(items) => <ArtistList artists={items} />} />
            ) : null}
            {section === 'tracks' ? (
                <TopSection className="elements_artists" data={tracks} render={(items) => <TrackList tracks={items} />} />
            ) : null}
        </div>
        </div>
    )
}

const TopSection = ({ className, data, render }) => {
    const [range, setRange] = useState(null);

    return (
        <div className={className}>
            <div className="box_artists">
                {TIME_RANGES.map(({ key, label }) => (
                    <div id="top_artists_component" key={key}>
                        <input type="submit" value={label} onClick={() => setRange(key)} />
                    </div>
                ))}
            </div>
            {/* key forces a remount per range so the popup shows again, as before */}
            {range ? <div key={range}>{render(data[range])}</div> : null}
        </div>
    )
}
