import PopUpArtist from "./PopUp_Artist";
import { image_url } from "../Important_Functions";

export default function ArtistList({ artists }) {
    return (
        <div>
            {artists.length > 0 ? <PopUpArtist artist={artists[0]} /> : null}
            {artists.map((artist, i) => (
                <div className="box_artist" key={artist.id}>
                    <div className="grid_box">
                        <h2>{i + 1}</h2>
                        <div><a href={artist.external_urls["spotify"]}><img className="img_artist" src={image_url(artist.images, 1)} alt="Imagen de Artista" /></a></div>
                        <div className="names">
                            <h3>{artist.name}</h3>
                            <p className="genres">{(artist.genres || []).join(", ")}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
