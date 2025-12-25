import { useState, useEffect } from 'react';
import config from '../config/api.config';
import './BusinessCard.css';

/**
 * BusinessCard Component
 * Displays a business with its details in a compact format
 * @param {Object} business - Business data
 */
const BusinessCard = ({ business }) => {
  const { 
    businessName, 
    category, 
    description, 
    location, 
    shopNo,
    street,
    city,
    country,
    coordinates,
    phone, 
    email, 
    photos 
  } = business;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract GPS coordinates if available
  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  
  // Helper function to build correct image URL
  const getImageUrl = (photo) => {
    if (!photo || !photo.path) return null;
    
    // If path already starts with 'uploads/', use it directly
    if (photo.path.startsWith('uploads/')) {
      return `${config.apiUrl}/${photo.path}`;
    }
    
    // If path contains full system path, extract just the filename
    if (photo.path.includes('\\') || photo.path.includes('uploads')) {
      const filename = photo.filename || photo.path.split(/[/\\]/).pop();
      return `${config.apiUrl}/uploads/${filename}`;
    }
    
    // Otherwise assume it's just a filename
    return `${config.apiUrl}/uploads/${photo.path}`;
  };

  // Get all valid photo URLs
  const photoUrls = photos && photos.length > 0 
    ? photos.map(photo => getImageUrl(photo)).filter(url => url !== null)
    : [];

  // Auto-advance carousel every 3 seconds if multiple images
  useEffect(() => {
    if (photoUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % photoUrls.length
        );
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [photoUrls.length]);

  // Navigate to next image
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % photoUrls.length
    );
  };

  // Navigate to previous image
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? photoUrls.length - 1 : prevIndex - 1
    );
  };

  // Jump to specific image
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Build display address - use structured address if available, otherwise use location
  const displayAddress = (street && city && country) 
    ? [shopNo, street, city, country].filter(Boolean).join(', ')
    : location;

  // Function to open location in Google Maps with exact pinpoint
  const openInMaps = () => {
    let mapsUrl;
    
    // Priority 1: Use GPS coordinates for exact pinpoint
    if (latitude && longitude) {
      // Opens Google Maps with exact coordinates and a marker/pin
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } 
    // Priority 2: Use address as fallback
    else {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`;
    }
    
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="business-card">
      {/* Business Image Carousel */}
      {photoUrls.length > 0 ? (
        <div className="business-card-image-carousel">
          <img 
            src={photoUrls[currentImageIndex]} 
            alt={`${businessName} - Image ${currentImageIndex + 1}`}
            className="carousel-image"
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Failed to load image:', photoUrls[currentImageIndex]);
            }}
          />
          <div className="business-card-badge">{category}</div>
          
          {/* Navigation arrows - only show if multiple images */}
          {photoUrls.length > 1 && (
            <>
              <button className="carousel-btn carousel-btn-prev" onClick={prevImage} aria-label="Previous image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"></path>
                </svg>
              </button>
              <button className="carousel-btn carousel-btn-next" onClick={nextImage} aria-label="Next image">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
              </button>
              
              {/* Image counter and dots */}
              <div className="carousel-indicators">
                <span className="image-counter">{currentImageIndex + 1}/{photoUrls.length}</span>
                <div className="carousel-dots">
                  {photoUrls.map((_, index) => (
                    <button
                      key={index}
                      className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => goToImage(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="business-card-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <div className="business-card-badge">{category}</div>
        </div>
      )}

      {/* Business Details */}
      <div className="business-card-content">
        <h3 className="business-card-title">{businessName}</h3>
        
        <p className="business-card-description">{description}</p>

        <div className="business-card-info">
          {/* Location with Map Icon */}
          <div className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{displayAddress}</span>
            {/* Map icon button - opens with exact pinpoint */}
            <button 
              className="map-icon-btn" 
              onClick={openInMaps}
              title={latitude && longitude ? "View exact location on map" : "View location on map"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
              {latitude && longitude && (
                <span className="gps-indicator" title="GPS coordinates available">📍</span>
              )}
            </button>
          </div>

          {/* Phone */}
          {phone && (
            <div className="info-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
          )}

          {/* Email */}
          <div className="info-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;

