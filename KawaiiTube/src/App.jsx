import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import NavigationTabs from './components/NavigationTabs';
import { House, Heart, Clock } from 'phosphor-react';
import SongGrid from './components/SongGrid';
import NowPlaying from './components/NowPlaying';
import WelcomeScreen from './components/WelcomeScreen';
import './styles/App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState('home');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });
  const audioRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Popular search suggestions
  const popularSearches = [
    'Taylor Swift', 'Bad Bunny', 'The Weeknd', 'Billie Eilish',
    'Drake', 'Ed Sheeran', 'Ariana Grande', 'BTS',
    'rock music', 'pop music', 'jazz', 'classical',
    'reggaeton', 'hip hop', 'country', 'k-pop'
  ];

  // Search music with debounce
  const searchMusic = async (query) => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=12`
      );
      const data = await response.json();
      setSongs(data.results || []);
      setActiveTab('home');
    } catch (error) {
      console.error('Error searching music:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim().length >= 1) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = popularSearches.filter(term =>
        term.toLowerCase().startsWith(searchLower) || 
        term.toLowerCase().includes(searchLower)
      ).sort((a, b) => {
        // Priorizar los que empiezan con el término
        const aStarts = a.toLowerCase().startsWith(searchLower);
        const bStarts = b.toLowerCase().startsWith(searchLower);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      });
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Auto-search as user types
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchMusic(searchTerm);
      }, 500);
    } else {
      setSongs([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Play/pause song
  const playSong = (song) => {
    if (currentSong?.trackId === song.trackId && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(s => s.trackId !== song.trackId);
        const newHistory = [song, ...filtered].slice(0, 50);
        localStorage.setItem('history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = (song) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.trackId === song.trackId);
      let newFavorites;
      if (exists) {
        newFavorites = prev.filter(fav => fav.trackId !== song.trackId);
      } else {
        newFavorites = [...prev, song];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (song) => {
    return favorites.some(fav => fav.trackId === song.trackId);
  };

  // Audio controls
  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const seekTo = (percentage) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const playNextSong = () => {
    const currentList = activeTab === 'favorites' ? favorites : songs;
    if (currentList.length === 0) return;

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * currentList.length);
      setCurrentSong(currentList[randomIndex]);
      setIsPlaying(true);
    } else {
      const currentIndex = currentList.findIndex(s => s.trackId === currentSong?.trackId);
      const nextIndex = (currentIndex + 1) % currentList.length;
      setCurrentSong(currentList[nextIndex]);
      setIsPlaying(true);
    }
  };

  const playPreviousSong = () => {
    const currentList = activeTab === 'favorites' ? favorites : songs;
    if (currentList.length === 0) return;

    const currentIndex = currentList.findIndex(s => s.trackId === currentSong?.trackId);
    const previousIndex = currentIndex <= 0 ? currentList.length - 1 : currentIndex - 1;
    setCurrentSong(currentList[previousIndex]);
    setIsPlaying(true);
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextSong();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeat, volume]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.previewUrl;
      audioRef.current.play();
    }
  }, [currentSong]);

  const displaySongs = activeTab === 'favorites' ? favorites : songs;

  return (
    <div className="app">
      {/* Decorative elements */}
      <div className="bg-pattern"></div>
      <div className="heart heart-1">💗</div>
      <div className="heart heart-2">💗</div>
      <div className="heart heart-3">💗</div>
      <div className="heart heart-4">💗</div>

      <div className="container">
        {/* Header */}
        <div className="window-header">
          <div className="title-bar">
            <div className="app-title">
              <span>🎵</span>
              <span>KawaiiTube</span>
            </div>
            <div className="window-controls">
              <button 
                className={`window-btn btn-tab ${activeTab === 'home' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('home')}
                title="Home"
              >
                <House className="btn-icon" size={28} color="#FF69B4" weight="fill" />
              </button>
              <button 
                className={`window-btn btn-tab ${activeTab === 'favorites' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('favorites')}
                title="Favorites"
              >
                <Heart className="btn-icon" size={28} color="#FF69B4" weight="fill" />
                {favorites.length > 0 && (
                  <span className="mini-badge">{favorites.length}</span>
                )}
              </button>
              <button 
                className={`window-btn btn-tab ${activeTab === 'library' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('library')}
                title="Library"
              >
                <Clock className="btn-icon" size={28} color="#DDA0DD" weight="fill" />
              </button>
            </div>
          </div>

          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            suggestions={suggestions}
          />
        </div>

        <div className="content-area">
          {loading ? (
            <div className="loading">
              <div className="loading-icon">🎵</div>
              <div className="empty-text">Loading kawaii music...</div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                songs.length === 0 ? (
                  <WelcomeScreen onSearch={searchMusic} />
                ) : (
                  <SongGrid 
                    songs={songs}
                    loading={false}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={playSong}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                )
              )}

              {activeTab === 'favorites' && (
                favorites.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💝</div>
                    <div className="empty-text">No favorites yet! Add some songs to your favorites! ♡</div>
                  </div>
                ) : (
                  <SongGrid 
                    songs={favorites}
                    loading={false}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={playSong}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                )
              )}

              {activeTab === 'library' && (
                history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎧</div>
                    <div className="empty-text">Your listening history will appear here! ♪</div>
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#DDA0DD' }}>
                      Start playing some music! ✨
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="section-header">
                      <h3 className="section-title">Recently Played 🎧</h3>
                      <button 
                        className="clear-history-btn"
                        onClick={() => {
                          setHistory([]);
                          localStorage.removeItem('history');
                        }}
                      >
                        Clear History
                      </button>
                    </div>
                    <SongGrid 
                      songs={history}
                      loading={false}
                      currentSong={currentSong}
                      isPlaying={isPlaying}
                      onPlay={playSong}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite}
                    />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {currentSong && (
        <NowPlaying 
          song={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          shuffle={shuffle}
          repeat={repeat}
          isFavorite={isFavorite(currentSong)}
          onTogglePlay={togglePlay}
          onSkipForward={skipForward}
          onSkipBackward={skipBackward}
          onSeek={seekTo}
          onVolumeChange={handleVolumeChange}
          onToggleFavorite={() => toggleFavorite(currentSong)}
          onNextSong={playNextSong}
          onPreviousSong={playPreviousSong}
          onToggleShuffle={() => setShuffle(!shuffle)}
          onToggleRepeat={() => setRepeat(!repeat)}
          onClose={closePlayer}
        />
      )}

      <audio ref={audioRef} />
    </div>
  );
}

export default App;
