import React from 'react';
import SongCard from './SongCard';
import '../styles/SongGrid.css';

function SongGrid({ songs, loading, currentSong, isPlaying, onPlay, onToggleFavorite, isFavorite }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-icon">🎵</div>
        <div className="empty-text">Loading kawaii music...</div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎀</div>
        <div className="empty-text">Search for your favorite music! ♪</div>
      </div>
    );
  }

  return (
    <div className="songs-grid">
      {songs.map((song) => (
        <SongCard
          key={song.trackId}
          song={song}
          isCurrentSong={currentSong?.trackId === song.trackId}
          isPlaying={isPlaying}
          isFavorite={isFavorite(song)}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default SongGrid;
