import {useState} from 'react'
import './PopUp_Styles.css'
import { image_url } from '../Important_Functions'

export default function PopUpArtist(props) {
    const [open, setOpen] = useState(true);
    if (!open) return null;

    return(
        <div className="modal">
            <div className="modal-content">
                <p id="title">Mi Top Artista fue:</p>
                <h1>{props.artist.name}</h1>
                <img id = "img_popup" src={image_url(props.artist.images)} alt="Imagen del artist" />
                <button id="button-close" aria-label="Cerrar" onClick={() => setOpen(false)}>X</button>
            </div>
        </div>
    )
}
