import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { CATEGORIES, FILTER_OPTIONS, POPULAR_SEARCHES } from '../constants';
import './SearchBar.css';

/**
 * SearchBar Component
 * Provides search functionality with suggestions and filters
 */
const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');

  // Initialize Fuse.js for fuzzy search with spelling mistake tolerance
  const fuse = useMemo(() => {
    return new Fuse(CATEGORIES, {
      threshold: 0.4, // 0.4 = allows for typos (0.0 = exact match, 1.0 = match anything)
      distance: 100, // Maximum distance to search
      keys: [''], // Search the string directly
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ q: searchQuery.trim(), category: activeFilter });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Generate suggestions using Fuse.js for better spelling mistake tolerance
    if (value.length > 1) {
      const results = fuse.search(value);
      const filteredSuggestions = results
        .map(result => result.item)
        .slice(0, 8); // Show up to 8 suggestions
      setSuggestions(filteredSuggestions);
    } else if (value.length === 1) {
      // For single character, use simple filter
      const filteredSuggestions = CATEGORIES.filter((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    // Show popular searches when focused with empty input
    if (searchQuery.length === 0) {
      setSuggestions(POPULAR_SEARCHES);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion); // Debug log
    setSearchQuery(suggestion);
    setSuggestions([]);
    setIsFocused(false);
    
    // Trigger search immediately
    if (onSearch) {
      console.log('Calling onSearch with:', suggestion); // Debug log
      onSearch({ q: suggestion, category: activeFilter });
    }
  };

  const handleFilterClick = (value) => {
    setActiveFilter(value);
    if (onSearch) {
      onSearch({ q: searchQuery.trim(), category: value });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder="Search for businesses, services, or locations..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={() => setTimeout(() => setIsFocused(false), 300)}
          />
          {searchQuery && <ClearButton onClick={clearSearch} />}
          <button type="submit" className="search-button">
            Search
          </button>
        </div>

        <SuggestionsDropdown
          suggestions={suggestions}
          isVisible={suggestions.length > 0 && isFocused}
          onSelect={handleSuggestionClick}
        />
      </form>

      <FilterChips
        options={FILTER_OPTIONS}
        activeFilter={activeFilter}
        onFilterClick={handleFilterClick}
      />
    </div>
  );
};

/**
 * Search Icon Component
 */
const SearchIcon = () => (
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
);

/**
 * Clear Button Component
 */
const ClearButton = ({ onClick }) => (
  <button type="button" className="clear-button" onClick={onClick}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
);

/**
 * Suggestions Dropdown Component
 */
const SuggestionsDropdown = ({ suggestions, isVisible, onSelect }) => {
  if (!isVisible) return null;

  return (
    <div className="suggestions-dropdown">
      <div className="suggestions-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Suggested Searches</span>
      </div>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="suggestion-item"
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent blur from firing
            onSelect(suggestion);
          }}
        >
          <svg
            className="suggestion-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>{suggestion}</span>
          <svg
            className="suggestion-arrow"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 7l10 10M7 17l10-10"></path>
          </svg>
        </div>
      ))}
    </div>
  );
};

/**
 * Filter Chips Component
 */
const FilterChips = ({ options, activeFilter, onFilterClick }) => (
  <div className="search-filters">
    {options.map((option, index) => (
      <button
        key={index}
        className={`filter-chip ${activeFilter === option.value ? 'active' : ''}`}
        onClick={() => onFilterClick(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default SearchBar;
