import './PopUp_Styles.css'
export default function PopUpArtist(props) {
    
    return( 
        <div id="myModal" className="modal">
            <div className="modal-content">
                <p id="title">Mi Top Artista fue:</p>
                <h1>{props.artist.name}</h1>
                <img id = "img_popup" src={props.artist.images[0]["url"]} alt="Imagen del artist" />
                <button id="button-close" onClick= {() =>  document.querySelector(".modal").style.display = 'none'}>X</button>
            </div>
        </div>
    )
}