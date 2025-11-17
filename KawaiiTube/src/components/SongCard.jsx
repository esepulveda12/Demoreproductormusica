import React from 'react';
import '../styles/SongCard.css';
import { Heart, Pause, Play } from 'phosphor-react';

function SongCard({ song, isCurrentSong, isPlaying, isFavorite, onPlay, onToggleFavorite }) {
  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`song-card ${isCurrentSong && isPlaying ? 'playing' : ''}`}>

      
      {isCurrentSong && isPlaying && (
        <div className="playing-indicator">
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar3"></span>
        </div>
      )}
      
      <button
        className="favorite-btn"
        onClick={() => onToggleFavorite(song)}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart size={28} weight={isFavorite ? 'fill' : 'regular'} color={isFavorite ? '#ec4899' : '#D36BA6'} />
      </button>

      <div className="album-art-full" onClick={() => onPlay(song)}>
        <img
          src={song.artworkUrl100.replace('100x100', '300x300')}
          alt={song.trackName}
          className="album-art"
        />
        <div className="play-overlay">
          {isCurrentSong && isPlaying ? (
            <Pause size={32} color="#8A6BA6" weight="fill" />
          ) : (
            <Play size={32} color="#8A6BA6" weight="fill" />
          )}
        </div>
      </div>

      <div className="song-title">{song.trackName}</div>
      <div className="song-artist">{song.artistName}</div>
      
      <div className="song-duration">
        <span>🎵 {formatDuration(song.trackTimeMillis)}</span>
        <span>♪</span>
      </div>
    </div>
  );
}

export default SongCard;
