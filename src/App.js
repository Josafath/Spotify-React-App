import './App.css';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import desktopImage from './images/Icon_White_Name.png';
import mobileImage from './images/Icon_White_NoName.png';
const App = () => {
  const [token,setToken] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageURL = windowWidth >= 650 ? desktopImage : mobileImage;

  const getHashParams = () =>{
    const hashParams = {};
    const r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    let e = r.exec(q)
    while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
    }
    return hashParams;
  }

  const generateRandomString = (length) =>{
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  useEffect(()=>{
    const params = getHashParams();

    const access_token = params.access_token;
    const state = params.state;
    const storedState = localStorage.getItem('stateKey');
    localStorage.setItem('spotifyAuthToken', access_token);
    localStorage.getItem('spotifyAuthToken');

    if (window.localStorage.getItem('authToken')) {
      console.log("Good Job!");
    }
    if (access_token && (state != null || state === storedState)) {
      localStorage.removeItem('stateKey');
    } 

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
      const stateKey = 'spotify_auth_state';
      const params = getHashParams();
      const access_token = params.access_token;
      setToken(access_token);

      const state = generateRandomString(16);
      localStorage.setItem(stateKey, state);
      const client_id = 'd42c6ab495b64b16b144d4df732489ac';
      let url =
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id='+  encodeURIComponent(client_id)+
      '&scope=' + encodeURIComponent('user-top-read') +
      '&redirect_uri=' + encodeURIComponent('https://jossify-joss.web.app/TopMusic')+
      '&state=' + encodeURIComponent(state);
      window.location = url;
  }
  
  return (
    
    <div>
      <div className="bgimg"></div>
      
      <div id="container">
        <img src={imageURL} alt="Spotify Logo"/>
        <div id = "redirectLink">
          <Link id= "link" onClick={(event) => handleRedirect(event)} to={{ pathname: "/TopMusic",access: token}}> Sign in with Spotify </Link>
        </div>
      </div>
    </div>      
  );
}

export default App;
