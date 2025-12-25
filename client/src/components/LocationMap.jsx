import { useState, useEffect } from 'react';
import './LocationMap.css';

/**
 * LocationMap Component
 * Shows a Google Maps embed for the provided location
 * @param {string} location - The location address to display on map
 * @param {string} businessName - Name of the business (optional, for marker label)
 * @param {string} latitude - GPS latitude coordinate
 * @param {string} longitude - GPS longitude coordinate
 * @param {boolean} compact - Whether to show compact version (default: false)
 */
const LocationMap = ({ 
  location, 
  businessName = '', 
  latitude = '', 
  longitude = '',
  compact = false 
}) => {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    // Priority 1: Use GPS coordinates if available (most accurate)
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      if (!isNaN(lat) && !isNaN(lon)) {
        // Use coordinates directly for pinpoint accuracy
        const url = `https://maps.google.com/maps?q=${lat},${lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        setMapUrl(url);
        return;
      }
    }
    
    // Priority 2: Use location address if no coordinates
    if (location && location.trim()) {
      const encodedLocation = encodeURIComponent(location);
      const url = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      setMapUrl(url);
    } else {
      setMapUrl('');
    }
  }, [location, businessName, latitude, longitude]);

  if (!mapUrl) {
    return (
      <div className={`location-map-placeholder ${compact ? 'compact' : ''}`}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <p>Enter a location to see map preview</p>
      </div>
    );
  }

  return (
    <div className={`location-map-container ${compact ? 'compact' : ''}`}>
      <div className="map-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className="map-label">
          {latitude && longitude ? 'Exact Location' : 'Location Preview'}
        </span>
      </div>
      <div className="map-wrapper">
        <iframe
          title="Business Location Map"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      {!compact && (
        <div className="map-footer">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${
              latitude && longitude 
                ? `${latitude},${longitude}` 
                : encodeURIComponent(location)
            }`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            Open in Google Maps
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default LocationMap;

