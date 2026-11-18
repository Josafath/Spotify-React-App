import PopUpArtist from "./PopUp_Artist";
import { image_url } from "../Important_Functions";

export default function ArtistList({ artists }) {
    return (
        <div>
            {artists.length > 0 ? <PopUpArtist artist={artists[0]} /> : null}
            {artists.map((artist, i) => (
                <div id="box_artist" key={artist.id}>
                    <div id="grid_box">
                        <h2>{i + 1}</h2>
                        <div><a href={artist.external_urls["spotify"]}><img className="img_artist" src={image_url(artist.images, 1)} alt="Imagen de Artista" /></a></div>
                        <div id="names">
                            <h3>{artist.name}</h3>
                            <p id="genres">{(artist.genres || []).join(", ")}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
