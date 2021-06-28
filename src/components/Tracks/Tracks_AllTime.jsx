import AudioTrack from './Audio'
import {return_artists} from '../Important_Functions';
import PopUpTrack from './PopUpTracks';
export default function TracksAllTime(data){

    const elements = Object.values(data.user_data["all_time_tracks"]).map((track,i) => {
        return (
            <div id="box_artist" key= {track.id}>
                <div id="grid_box">
                  <h2>{i+1}</h2> 
                  <div><a href={track.external_urls["spotify"]}><img className="img_artist" src={track.album.images[1]["url"]} alt="Imagen de Artista" /></a></div>                    
                    <div id="names">
                        <h3>{track.name}</h3>
                        <p id="genres">{return_artists(track.artists)}</p>
                    </div>
                    <AudioTrack url = {track.preview_url}/>
                </div>
            </div>
        );
    })
    return (
        <div>
            {elements ? <PopUpTrack artist = {data.user_data["all_time_tracks"][0]}/>: null}
            {elements}
        </div>
    )
    }