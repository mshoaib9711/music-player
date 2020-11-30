import React from "react";

function LibrarySong({ song, songs, setCurrentSong, id, setSongs }) {
  function songSelectHandle() {
    setCurrentSong(song);
    setSongs(
      songs.map((targetSong) => {
        return {
          ...targetSong,
          active: targetSong.id === id
        };
      })
    );
  }
  return (
    <div
      onClick={songSelectHandle}
      className={`library-song ${song.active ? "selected" : ""}`}
    >
      <img src={song.cover} alt="song-img" />
      <div className="song-description">
        <h3>{song.name}</h3>
        <h4>{song.artist}</h4>
      </div>
    </div>
  );
}

export default LibrarySong;
