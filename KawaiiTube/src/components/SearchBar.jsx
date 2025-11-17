import React, { useState, useEffect, useRef } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ searchTerm, setSearchTerm, suggestions }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim().length >= 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container" ref={searchBoxRef}>
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm.trim().length >= 1 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search for music..."
        />
        {searchTerm && (
          <button 
            className="clear-btn" 
            onClick={() => {
              setSearchTerm('');
              setShowSuggestions(false);
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="suggestion-icon">🎵</span>
              <span className="suggestion-text">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
