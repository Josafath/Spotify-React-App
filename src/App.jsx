import './App.css';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import desktopImage from './images/Icon_White_Name.png';
import mobileImage from './images/Icon_White_NoName.png';
import { redirectToSpotifyAuth } from './auth/spotifyAuth';
const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageURL = windowWidth >= 650 ? desktopImage : mobileImage;

  useEffect(()=>{
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };
  
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }

  },[]);

  const handleRedirect = (event) =>{
    event.preventDefault();
    redirectToSpotifyAuth();
  }
  
  return (
    
    <div>
      <div className="bgimg"></div>
      
      <div id="container">
        <img src={imageURL} alt="Spotify Logo"/>
        <div id = "redirectLink">
          <Link id= "link" onClick={(event) => handleRedirect(event)} to="/TopMusic"> Sign in with Spotify </Link>
        </div>
      </div>
    </div>      
  );
}

export default App;
