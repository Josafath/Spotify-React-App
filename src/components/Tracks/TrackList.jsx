import AudioTrack from './Audio'
import { return_artists, image_url } from '../Important_Functions';
import PopUpTrack from './PopUpTracks';

export default function TrackList({ tracks }) {
    return (
        <div>
            {tracks.length > 0 ? <PopUpTrack artist={tracks[0]} /> : null}
            {tracks.map((track, i) => (
                <div className="box_artist" key={track.id}>
                    <div className="grid_box">
                        <h2>{i + 1}</h2>
                        <div><a href={track.external_urls["spotify"]}><img className="img_artist" src={image_url(track.album.images, 1)} alt="Imagen de Artista" /></a></div>
                        <div className="names">
                            <h3>{track.name}</h3>
                            <p className="genres">{return_artists(track.artists)}</p>
                        </div>
                        <AudioTrack url={track.preview_url} />
                    </div>
                </div>
            ))}
        </div>
    )
}
