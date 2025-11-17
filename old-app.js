// State management
let state = {
  searchTerm: '',
  songs: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  currentSong: null,
  isPlaying: false,
  activeTab: 'home'
};

const audioPlayer = document.getElementById('audioPlayer');


function searchMusic() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();
  
  if (!query) return;
  
  state.searchTerm = query;
  fetchSongs(query);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    searchMusic();
  }
}

async function fetchSongs(query) {
  const contentArea = document.getElementById('contentArea');
  
  // Show loading state
  contentArea.innerHTML = `
    <div class="loading">
      <div class="loading-icon">🎵</div>
      <div class="empty-text">Loading kawaii music...</div>
    </div>
  `;
  
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=12`
    );
    const data = await response.json();
    
    state.songs = data.results || [];
    renderSongs();
  } catch (error) {
    console.error('Error fetching music:', error);
    contentArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😢</div>
        <div class="empty-text">Oops! Something went wrong...</div>
      </div>
    `;
  }
}

// Tab switching
function switchTab(tab) {
  state.activeTab = tab;
  
  // Update tab styles
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`${tab}Tab`).classList.add('active');
  
  // Render appropriate content
  if (tab === 'favorites') {
    renderFavorites();
  } else if (tab === 'home') {
    renderSongs();
  } else {
    document.getElementById('contentArea').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">☁️</div>
        <div class="empty-text">Library coming soon! ♡</div>
      </div>
    `;
  }
}

// Render songs
function renderSongs() {
  const contentArea = document.getElementById('contentArea');
  
  if (state.songs.length === 0) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎀</div>
        <div class="empty-text">Search for your favorite music! ♪</div>
      </div>
    `;
    return;
  }
  
  contentArea.innerHTML = `
    <div class="songs-grid">
      ${state.songs.map(song => createSongCard(song)).join('')}
    </div>
  `;
}

// Render favorites
function renderFavorites() {
  const contentArea = document.getElementById('contentArea');
  
  if (state.favorites.length === 0) {
    contentArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💝</div>
        <div class="empty-text">No favorites yet! ♡</div>
      </div>
    `;
    return;
  }
  
  contentArea.innerHTML = `
    <div class="songs-grid">
      ${state.favorites.map(song => createSongCard(song)).join('')}
    </div>
  `;
}

// Create song card HTML
function createSongCard(song) {
  const isFav = state.favorites.some(f => f.trackId === song.trackId);
  const duration = formatDuration(song.trackTimeMillis);
  
  return `
    <div class="song-card">
      <div class="song-card-star">⭐</div>
      <button class="favorite-btn" onclick="toggleFavorite(${song.trackId})">
        ${isFav ? '💖' : '🤍'}
      </button>
      <div class="album-art-container" onclick="playSong(${song.trackId})">
        <img class="album-art" src="${song.artworkUrl100}" alt="${song.trackName}" />
        <div class="play-overlay">
          ${state.currentSong?.trackId === song.trackId && state.isPlaying ? '⏸️' : '▶️'}
        </div>
      </div>
      <div class="song-title">${escapeHtml(song.trackName)}</div>
      <div class="song-artist">${escapeHtml(song.artistName)}</div>
      <div class="song-duration">
        <span>🎵 ${duration}</span>
        <span>♪</span>
      </div>
    </div>
  `;
}

// Format duration
function formatDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Toggle favorite
function toggleFavorite(trackId) {
  const song = [...state.songs, ...state.favorites].find(s => s.trackId === trackId);
  if (!song) return;
  
  const index = state.favorites.findIndex(f => f.trackId === trackId);
  
  if (index >= 0) {
    state.favorites.splice(index, 1);
  } else {
    state.favorites.push(song);
  }
  
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
  
  // Re-render current view
  if (state.activeTab === 'favorites') {
    renderFavorites();
  } else {
    renderSongs();
  }
}

// Play song
function playSong(trackId) {
  const song = [...state.songs, ...state.favorites].find(s => s.trackId === trackId);
  if (!song) return;
  
  if (state.currentSong?.trackId === trackId && state.isPlaying) {
    audioPlayer.pause();
    state.isPlaying = false;
  } else {
    state.currentSong = song;
    audioPlayer.src = song.previewUrl;
    audioPlayer.play();
    state.isPlaying = true;
    
    updateNowPlaying();
  }
  
  // Re-render to update play buttons
  if (state.activeTab === 'favorites') {
    renderFavorites();
  } else {
    renderSongs();
  }
}

// Toggle play/pause
function togglePlay() {
  if (!state.currentSong) return;
  
  if (state.isPlaying) {
    audioPlayer.pause();
    state.isPlaying = false;
    document.getElementById('playIcon').textContent = '▶️';
  } else {
    audioPlayer.play();
    state.isPlaying = true;
    document.getElementById('playIcon').textContent = '⏸️';
  }
}

// Update now playing bar
function updateNowPlaying() {
  const nowPlaying = document.getElementById('nowPlaying');
  const npArt = document.getElementById('npArt');
  const npTitle = document.getElementById('npTitle');
  const npArtist = document.getElementById('npArtist');
  const playIcon = document.getElementById('playIcon');
  
  if (state.currentSong) {
    nowPlaying.style.display = 'block';
    npArt.src = state.currentSong.artworkUrl100;
    npTitle.textContent = state.currentSong.trackName;
    npArtist.textContent = state.currentSong.artistName;
    playIcon.textContent = state.isPlaying ? '⏸️' : '▶️';
  } else {
    nowPlaying.style.display = 'none';
  }
}

// Audio player events
audioPlayer.addEventListener('ended', () => {
  state.isPlaying = false;
  document.getElementById('playIcon').textContent = '▶️';
});

audioPlayer.addEventListener('play', () => {
  state.isPlaying = true;
  document.getElementById('playIcon').textContent = '⏸️';
});

audioPlayer.addEventListener('pause', () => {
  state.isPlaying = false;
  document.getElementById('playIcon').textContent = '▶️';
});

// Initialize
console.log('🎵✨ KawaiiTube - Retro Music Player initialized! ✨🎵');
console.log('Search for your favorite music and enjoy! ♪(´▽｀)');
