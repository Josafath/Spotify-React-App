import { return_artists } from '../Important_Functions'
import './PopUp_Styles_Track.css'
export default function PopUpTrack(props) {
    return(
        <div id="myModal" className="modal_track">
        <div className="modal-content_track">
            <p id="title_track">Mi Top Track fue:</p>
            <img id = "img_popup_track" src={props.artist.album.images[0]["url"]} alt="Imagen del artist" />
            <h1 className="name_song">{props.artist.name}</h1>
            <p>{return_artists(props.artist.artists)}</p>
            <button id="button-close_track" onClick= {() =>  document.querySelector(".modal_track").style.display = 'none'}>X</button>
            
        </div>
    </div>
    )
}