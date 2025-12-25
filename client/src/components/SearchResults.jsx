import { useEffect, useRef } from 'react';
import BusinessCard from './BusinessCard';
import './SearchResults.css';

/**
 * SearchResults Component
 * Displays search results with business cards
 * @param {Array} businesses - Array of business objects
 * @param {boolean} loading - Loading state
 * @param {string} searchQuery - Current search query
 */
const SearchResults = ({ businesses = [], loading = false, searchQuery = '' }) => {
  const resultsRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (!loading && businesses.length > 0 && resultsRef.current) {
      // Smooth scroll to the results section
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [loading, businesses.length]);

  // Loading state
  if (loading) {
    return (
      <div className="search-results-container" ref={resultsRef}>
        <div className="search-results-loading">
          <div className="loading-spinner-large"></div>
          <p>Searching for businesses...</p>
        </div>
      </div>
    );
  }

  // No results
  if (!businesses || businesses.length === 0) {
    return (
      <div className="search-results-container" ref={resultsRef}>
        <div className="search-results-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>No businesses found</h3>
          {searchQuery ? (
            <p>
              We couldn't find any businesses matching "<strong>{searchQuery}</strong>"
              <br />
              Try different keywords or check your spelling
            </p>
          ) : (
            <p>No businesses have been added yet. Be the first to add yours!</p>
          )}
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="search-results-container" ref={resultsRef}>
      <div className="search-results-header">
        <h2 className="search-results-title">
          {searchQuery ? (
            <>
              Search Results for "<span className="search-highlight">{searchQuery}</span>"
            </>
          ) : (
            'All Businesses'
          )}
        </h2>
        <p className="search-results-count">
          {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} found
        </p>
      </div>

      <div className="search-results-grid">
        {businesses.map((business, index) => (
          <BusinessCard 
            key={business._id || business.id || `business-${index}`} 
            business={business} 
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

