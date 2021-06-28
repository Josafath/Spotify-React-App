import PopUpArtist from "./PopUp_Artist";


export default function ArtistsAllTime(data){
    const elements = Object.values(data.user_data["all_time_artists"]).map((artist,i) => {
        return (
            <div id="box_artist" key= {artist.id}>
                <div id="grid_box">
                  <h2>{i+1}</h2> 
                  <div><a href={artist.external_urls["spotify"]}><img className="img_artist" src={artist.images[0]["url"]} alt="Imagen de Artista" /></a></div>                    
                    <div id="names">
                        <h3>{artist.name}</h3>
                        <p id="genres">{artist.genres.join(", ")}</p>
                    </div>
                </div>
            </div>
        );
    })
    return (
        <div>
            {elements ? <PopUpArtist artist = {data.user_data["all_time_artists"][0]}/>: null}
            {elements}
        </div>
    )
    }