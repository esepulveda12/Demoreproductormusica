import React from 'react';
import '../styles/WelcomeScreen.css';

function WelcomeScreen({ onSearch }) {
  const popularSearches = [
    { image: '/imagenes/kawaii-cat-music.jpeg', name: 'Rock', query: 'rock music' },
    { image: '/imagenes/kawaii-headphones.jpeg', name: 'Pop', query: 'pop music' },
    { image: '/imagenes/kawaii-piano.jpeg', name: 'Piano', query: 'piano music' },
    { image: '/imagenes/kawaii-stars.jpeg', name: 'Classical', query: 'classical music' },
    { image: '/imagenes/kawaii-bunny.jpeg', name: 'K-Pop', query: 'kpop music' },
    { image: '/imagenes/kawaii-rainbow.jpeg', name: 'Electronic', query: 'electronic music' },
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-title">Welcome to KawaiiTube! ♪</div>
        <div className="welcome-subtitle">
          Search for your favorite music and enjoy!
        </div>
      </div>

      <div className="featured-section">
        <div className="section-title">
          <span>✨</span>
          <span>Popular Searches</span>
          <span>✨</span>
        </div>
        
        <div className="kawaii-gallery">
          {popularSearches.map((item, index) => (
            <div
              key={index}
              className="kawaii-card"
              onClick={() => onSearch(item.query)}
            >
              <div className="kawaii-img-container">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="kawaii-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="kawaii-fallback">🎵</div>
              </div>
              <div className="kawaii-name">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-footer">
        <div className="footer-icon">🎀</div>
        <div className="footer-text">
          Start searching to discover amazing music!
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
