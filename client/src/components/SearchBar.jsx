import { useState } from 'react';
import './SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Simulate AI-powered suggestions
    if (value.length > 0) {
      const mockSuggestions = [
        'Restaurant',
        'Retail Store',
        'Tech Startup',
        'Consulting',
        'Healthcare',
        'Education'
      ].filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(mockSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
          <svg 
            className="search-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search for businesses, services, or locations..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
        
        {suggestions.length > 0 && isFocused && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSuggestions([]);
                }}
              >
                <svg className="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </form>
      
      <div className="search-filters">
        <button className="filter-chip active">All</button>
        <button className="filter-chip">Restaurants</button>
        <button className="filter-chip">Retail</button>
        <button className="filter-chip">Services</button>
        <button className="filter-chip">Tech</button>
      </div>
    </div>
  );
};

export default SearchBar;

