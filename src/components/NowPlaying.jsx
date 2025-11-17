import React from 'react';
import '../styles/NowPlaying.css';
import { Heart, SkipBack, Play, Pause, SkipForward, X, SpeakerHigh } from 'phosphor-react';

function NowPlaying({ song, isPlaying, currentTime, duration, volume, isFavorite, onTogglePlay, onSkipForward, onSkipBackward, onSeek, onVolumeChange, onToggleFavorite, onClose }) {
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressChange = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek((percentage / 100) * duration);
  };

  return (
    <div className="music-player-kawaii">
      <div className="player-inner">
        <div className="album-art">
          <img src={song.artworkUrl100.replace('100x100', '300x300')} alt={song.trackName} />
        </div>
        <div className="player-details">
          <div className="player-header">
            <h2 className="player-title">{song.trackName}</h2>
            <p className="player-artist">{song.artistName}</p>
          </div>
          <div className="player-progress">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={e => onSeek(Number(e.target.value))}
              className="progress-slider"
              style={{ background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${progress}%, #d1d5db ${progress}%, #d1d5db 100%)` }}
            />
            <span className="player-duration">{formatTime(duration)}</span>
          </div>
          <div className="player-controls">
            <button className={`player-btn heart-btn${isFavorite ? ' active' : ''}`} onClick={onToggleFavorite}>
              <Heart size={28} weight={isFavorite ? 'fill' : 'regular'} color={isFavorite ? '#ec4899' : '#D36BA6'} />
            </button>
            <button className="player-btn" onClick={onSkipBackward}>
              <SkipBack size={28} color="#D36BA6" />
            </button>
            <button className="player-btn play-btn" onClick={onTogglePlay}>
              {isPlaying ? <Pause size={36} color="#D36BA6" /> : <Play size={36} color="#D36BA6" />}
            </button>
            <button className="player-btn" onClick={onSkipForward}>
              <SkipForward size={28} color="#D36BA6" />
            </button>
            <button className="player-btn close-btn" onClick={onClose}>
              <X size={28} color="#D36BA6" />
            </button>
          </div>
          <div className="player-volume">
            <span className="volume-icon"><SpeakerHigh size={24} color="#D36BA6" /></span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={e => onVolumeChange(Number(e.target.value))}
              className="volume-slider"
              style={{ background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volume}%, #d1d5db ${volume}%, #d1d5db 100%)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NowPlaying;
