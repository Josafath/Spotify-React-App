import {useEffect, useState, useRef} from 'react';
import './Audio.css'
function MyAudio({url}) {
  
    const [isPlaying,setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio(url));
    
    const onPause = () =>{
      setIsPlaying(false)
    }
    const onPlay = () =>{
        setIsPlaying(true)
      
    }
  
    useEffect(() =>{
      if(isPlaying){
        audioRef.current.play();
      }else{
        audioRef.current.pause();
      }
    }, [isPlaying])
  
    useEffect(() => {
      audioRef.current.onended = () =>{
        setIsPlaying(false)
      }
    })
  
  
    return (
      <div>{isPlaying ? <button id="pause" onClick={onPause}></button> : <button id="play" onClick = {onPlay}></button>}</div>
    );
  }
  
  export default MyAudio;