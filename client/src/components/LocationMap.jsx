import { useState, useEffect } from 'react';
import './LocationMap.css';

/**
 * LocationMap Component
 * Shows a Google Maps embed for the provided location
 * @param {string} location - The location address to display on map
 * @param {string} businessName - Name of the business (optional, for marker label)
 */
const LocationMap = ({ location, businessName = '' }) => {
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    if (location && location.trim()) {
      // Encode the location for URL
      const encodedLocation = encodeURIComponent(location);
      const encodedBusinessName = businessName ? encodeURIComponent(businessName) : '';
      
      // Create Google Maps embed URL
      // Using Google Maps Embed API (free, no API key needed for basic use)
      const url = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedLocation}`;
      
      // Alternative: Use iframe with regular Google Maps (works without API key)
      const alternativeUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      
      setMapUrl(alternativeUrl);
    } else {
      setMapUrl('');
    }
  }, [location, businessName]);

  if (!mapUrl) {
    return (
      <div className="location-map-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <p>Enter a location to see it on the map</p>
      </div>
    );
  }

  return (
    <div className="location-map-container">
      <div className="map-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className="map-label">Location Preview</span>
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
      <div className="map-footer">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          Open in Google Maps
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default LocationMap;

