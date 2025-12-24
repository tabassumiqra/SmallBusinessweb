import { LocationMap } from './';
import './BusinessCard.css';

/**
 * BusinessCard Component
 * Displays a business with its details and location map
 * @param {Object} business - Business data
 */
const BusinessCard = ({ business }) => {
  const { businessName, category, description, location, phone, email, photos } = business;
  
  // Get the first photo or use placeholder
  const mainPhoto = photos && photos.length > 0 
    ? `http://localhost:5000/${photos[0].path}` 
    : null;

  return (
    <div className="business-card">
      {/* Business Image */}
      {mainPhoto ? (
        <div className="business-card-image">
          <img src={mainPhoto} alt={businessName} />
          <div className="business-card-badge">{category}</div>
        </div>
      ) : (
        <div className="business-card-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          {/* Location */}
          <div className="info-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </div>

          {/* Phone */}
          {phone && (
            <div className="info-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
          )}

          {/* Email */}
          <div className="info-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>

        {/* Location Map */}
        <div className="business-card-map">
          <LocationMap location={location} businessName={businessName} />
        </div>

        {/* More Photos */}
        {photos && photos.length > 1 && (
          <div className="business-card-gallery">
            <div className="gallery-label">More Photos</div>
            <div className="gallery-grid">
              {photos.slice(1, 5).map((photo, index) => (
                <img 
                  key={photo.filename || photo.path || `photo-${index}`}
                  src={`http://localhost:5000/${photo.path}`} 
                  alt={`${businessName} ${index + 2}`}
                  className="gallery-image"
                />
              ))}
              {photos.length > 5 && (
                <div className="gallery-more">+{photos.length - 5} more</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;

