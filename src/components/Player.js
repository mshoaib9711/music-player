import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause
} from "@fortawesome/free-solid-svg-icons";

function Player({
  currentSong,
  songs,
  setCurrentSong,
  setSongs,
  isPlaying,
  setIsPlaying
}) {
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0
  });
  const audioRef = useRef(null);
  useEffect(() => {
    setSongs(
      songs.map((targetSong) => {
        return {
          ...targetSong,
          active: targetSong.id === currentSong.id
        };
      })
    );
  }, [currentSong]);
  function playSongHandler() {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }
  function updateTimeHandler(e) {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    const animationPercentage = Math.round((currentTime / duration) * 100);
    setSongInfo({ currentTime, duration, animationPercentage });
  }
  function getTime(time) {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  }
  function dragHandler(e) {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  }
  function autoPlayHandler() {
    if (isPlaying) {
      audioRef.current.play();
    }
  }
  function skipTrackHandler(direction) {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "forward") {
      setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    } else if (direction === "back") {
      if ((currentIndex - 1) % songs.length === -1) {
        setCurrentSong(songs[songs.length - 1]);
        return;
      }
      setCurrentSong(songs[(currentIndex - 1) % songs.length]);
    }
  }
  function songEndHandler() {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
  }
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`
  };
  return (
    <div className="player">
      <div className="time-control">
        {<p>{songInfo ? getTime(songInfo.currentTime) : "0.00"}</p>}
        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`
          }}
          className="track"
        >
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type="range"
            onChange={(e) => dragHandler(e)}
          />
          <div style={trackAnim} className="animate-track"></div>
        </div>
        {<p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>}
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
      <audio
        onTimeUpdate={(e) => updateTimeHandler(e)}
        onLoadedMetadata={updateTimeHandler}
        onLoadedData={autoPlayHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      />
    </div>
  );
}

export default Player;
