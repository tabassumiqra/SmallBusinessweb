import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SearchBar, SearchResults } from '../components';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { businessService } from '../services';
import './HomePage.css';

/**
 * HomePage Component
 * Main landing page with search and navigation to add business
 */
const HomePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async ({ q, category }) => {
    try {
      setLoading(true);
      setHasSearched(true);
      setSearchQuery(q || category || '');
      
      // If no search query and no category, show message to enter search
      if (!q && !category) {
        setBusinesses([]);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      const data = await businessService.search({ q, category });
      setBusinesses(data.businesses || data);
    } catch (error) {
      console.error('Search error:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusinessClick = () => {
    if (isAuthenticated) {
      navigate('/add-business');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/add-business');
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1 className="logo">SmallBiz</h1>
        </div>
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span>
              <button className="btn-add-business" onClick={handleAddBusinessClick}>
                + Add Business
              </button>
              <button className="btn-logout" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-add-business" onClick={handleAddBusinessClick}>
              + Add Your Business
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Local <span className="highlight">Businesses</span>
          </h1>
          <p className="hero-subtitle">
            Connect with amazing local businesses in your community
          </p>
        </div>
      </header>

      {/* Search Section */}
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />

        {/* Search Results - Only show after search */}
        {hasSearched && (
          <SearchResults 
            businesses={businesses} 
            loading={loading}
            searchQuery={searchQuery}
          />
        )}

        {/* Call to Action Card */}
        <div className="cta-card" onClick={handleAddBusinessClick}>
          <div className="cta-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div className="cta-content">
            <h3 className="cta-title">Own a Business?</h3>
            <p className="cta-description">
              List your business and reach thousands of potential customers in your area
            </p>
          </div>
          <div className="cta-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
        redirectPath="/add-business"
      />
    </div>
  );
};

export default HomePage;
