import {useState} from 'react'
import { return_artists, image_url } from '../Important_Functions'
import './PopUp_Styles_Track.css'

export default function PopUpTrack(props) {
    const [open, setOpen] = useState(true);
    if (!open) return null;

    return(
        <div className="modal_track">
        <div className="modal-content_track">
            <p id="title_track">Mi Top Track fue:</p>
            <img id = "img_popup_track" src={image_url(props.artist.album.images)} alt="Imagen del artist" />
            <h1 className="name_song">{props.artist.name}</h1>
            <p>{return_artists(props.artist.artists)}</p>
            <button id="button-close_track" aria-label="Cerrar" onClick={() => setOpen(false)}>X</button>
        </div>
    </div>
    )
}
