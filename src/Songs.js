import './Songs.css'
import Logo from './images/Spotify_Logo_RGB_Green.png'
import {useEffect, useState} from 'react'
import ArtistsAllTime from './components/Artists/Artists_All_Time';
import ArtistsLastMonth from './components/Artists/Artists_Last_Month';
import ArtistLastSixMonths from './components/Artists/Artists_Last_Six_Months';
import TracksAllTime from './components/Tracks/Tracks_AllTime';
import TracksLast6Months from './components/Tracks/Tracks_SixMonths';
import TracksLastMonth from './components/Tracks/Tracks_LastMonth';
import { return_token } from './components/Important_Functions';
import axios from 'axios'

export default function Songs(props) {
    const user_token = return_token(props.location['hash']);

    const [showArtists, setArtists] = useState(false);
    const [showTracks, setTracks] = useState(false);
    //Functions for handle clicks to show certain component
    const onClick_Artists = () => setArtists(true) & setTracks(false)
    const onClick_Tracks = () => setTracks(true) & setArtists(false) 
    
    //States of the Tracks
    const [AllTimeTracks,setAllTimeTracks] = useState({});
    const [SixTimeTracks,setSixTimeTracks] = useState({});
    const [LastMonthTracks,setLastMonthTracks] = useState({});
    //States of the Artists
    const [AllTimeArtists,setAllTimeArtists] = useState({});
    const [SixTimeArtists,setSixTimeArtists] = useState({});
    const [LastMonthArtists,setLastMonthArtists] = useState({});
    
    useEffect(()=>{
        const fetch_user_tracks = async () => {
            const alltime = await axios(
                'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=40', 
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user_token
                    }
                });
            setAllTimeTracks(alltime.data.items)
            
            const sixmonths = await axios(
                'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=40', 
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user_token
                    }
                });
            setSixTimeTracks(sixmonths.data.items)
            const lastmonth = await axios(
                'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=40', 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user_token
                }
            })
            setLastMonthTracks(lastmonth.data.items)
        };
        // Function to fetching the Top Artists of the user
        const fetch_user_artists = async () => {
            const alltime_artists = await axios(
                'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=40', 
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user_token
                    }
                });
            setAllTimeArtists(alltime_artists.data.items)
            const sixmonths_artists = await axios(
                'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=40', 
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user_token
                    }
                });
            setSixTimeArtists(sixmonths_artists.data.items)
            const lastmonth_artists = await axios(
                'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=40', 
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user_token
                }
            })
            setLastMonthArtists(lastmonth_artists.data.items)
        };
        // Executing the functions
        fetch_user_tracks();
        fetch_user_artists();
    },[user_token])
    return(
        <div>
        <div className="container">
            <img className= "Logo" src={Logo} alt="Spotify Logo" />
            <div className="box">
                <div id="top_artists" >
                    <input type="submit" value="Top Artists" onClick={onClick_Artists} />
                </div>
                <div id="top_tracks">
                    <input type="submit" value="Top Tracks" onClick={onClick_Tracks} />
                </div>
            </div>
            {showArtists  ? <TopArtists  all_time_artists= {AllTimeArtists} six_months_artists = {SixTimeArtists} last_month_artists = {LastMonthArtists}   /> : null }
            {showTracks ? <TopTracks  all_time_tracks= {AllTimeTracks} six_months_tracks = {SixTimeTracks} last_month_tracks = {LastMonthTracks} /> : null }
        </div>
            
        </div>
    )
}

const TopArtists = (data) => {
    
    const [showAllTime, setAllTime] = useState(false);
    const [showLast6Months, setLast6Months] = useState(false);
    const [showLastMonth, setLastMonth] = useState(false);
    const onClick_LastMonth = () => setLastMonth(true) & setLast6Months(false) & setAllTime(false);
    const onClick_Last6Month = () => setLast6Months(true) & setLastMonth(false) & setAllTime(false);
    const onClick_AllTime = () => setAllTime(true) & setLastMonth(false) & setLast6Months(false);

    return (
        <div className="elements_tracks">
             <div className="box_artists">
                    <div id="top_artists_component">
                        <input type="submit" value="All Time" onClick={onClick_AllTime} />
                    </div>
                    <div id="top_artists_component">
                        <input type="submit" value="Last 6 Months" onClick={onClick_Last6Month} />
                    </div>
                    <div id="top_artists_component">
                        <input type="submit" value="Last Month" onClick={onClick_LastMonth} />
                    </div>
            </div >
                {showAllTime  ? <ArtistsAllTime user_data = {data} /> : null }
                {showLast6Months ? <ArtistLastSixMonths user_data = {data} /> : null }
                {showLastMonth ? <ArtistsLastMonth user_data = {data} /> : null }
        </div>
    

    )
}
  const TopTracks = (data) => {
        const [showAllTime, setAllTime] = useState(false);
        const [showLast6Months, setLast6Months] = useState(false);
        const [showLastMonth, setLastMonth] = useState(false);
        const onClick_LastMonth = () => setLastMonth(true) & setLast6Months(false) & setAllTime(false);
        const onClick_Last6Month = () => setLast6Months(true) & setLastMonth(false) & setAllTime(false);
        const onClick_AllTime = () => setAllTime(true) & setLastMonth(false) & setLast6Months(false);
    
        return (
            <div className="elements_artists">
                 <div className="box_artists">
                        <div id="top_artists_component">
                            <input type="submit" value="All Time" onClick={onClick_AllTime} />
                        </div>
                        <div id="top_artists_component">
                            <input type="submit" value="Last 6 Months" onClick={onClick_Last6Month} />
                        </div>
                        <div id="top_artists_component">
                            <input type="submit" value="Last Month" onClick={onClick_LastMonth} />
                        </div>
                </div >
                    {showAllTime  ? <TracksAllTime user_data = {data} /> : null }
                    {showLast6Months ? <TracksLast6Months user_data = {data} /> : null }
                    {showLastMonth ? <TracksLastMonth user_data = {data} /> : null }
            </div>    
      )
  }