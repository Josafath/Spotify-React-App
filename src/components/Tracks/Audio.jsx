import {useEffect, useState, useRef} from 'react';
import './Audio.css'

// Only one preview may play at a time across the whole app.
let currentAudio = null;

function MyAudio({url}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!url) return undefined;

    const audio = new Audio(url);
    audioRef.current = audio;
    const onPlay = () => setIsPlaying(true);
    const onStop = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onStop);
    audio.addEventListener('ended', onStop);

    return () => {
      // Remove listeners first so pausing doesn't set state on an unmounted component.
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onStop);
      audio.removeEventListener('ended', onStop);
      audio.pause();
      if (currentAudio === audio) currentAudio = null;
      audioRef.current = null;
    };
  }, [url]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // Pausing the previous track fires its 'pause' event, which resets its button.
      if (currentAudio && currentAudio !== audio) currentAudio.pause();
      currentAudio = audio;
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  // Spotify no longer returns previews for most tracks; keep the grid cell empty.
  if (!url) return <div></div>;

  return (
    <div>
      {isPlaying
        ? <button className="pause" aria-label="Pausar vista previa" onClick={toggle}></button>
        : <button className="play" aria-label="Reproducir vista previa" onClick={toggle}></button>}
    </div>
  );
}

export default MyAudio;
