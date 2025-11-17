import React from 'react';
import '../styles/NavigationTabs.css';

function NavigationTabs({ activeTab, setActiveTab, favoritesCount }) {
  return (
    <div className="nav-tabs">
      <button
        className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <div className="nav-icon">🐰</div>
        <div className="nav-label">Home</div>
      </button>

      <button
        className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => setActiveTab('favorites')}
      >
        <div className="nav-icon">
          💖
          {favoritesCount > 0 && (
            <span className="badge">{favoritesCount}</span>
          )}
        </div>
        <div className="nav-label">Favorites</div>
      </button>

      <button
        className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
        onClick={() => setActiveTab('library')}
      >
        <div className="nav-icon">☁️</div>
        <div className="nav-label">Library</div>
      </button>
    </div>
  );
}

export default NavigationTabs;
