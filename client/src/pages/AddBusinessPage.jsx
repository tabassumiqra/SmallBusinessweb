import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services';
import { useForm, usePhotoUpload } from '../hooks';
import { CATEGORIES } from '../constants';
import AuthModal from '../components/AuthModal';
import { LocationMap } from '../components';
import './AddBusinessPage.css';

/**
 * Initial form values for business form
 */
const initialFormValues = {
  businessName: '',
  category: '',
  description: '',
  shopNo: '',
  street: '',
  city: '',
  country: '',
  location: '',
  latitude: '',
  longitude: '',
  phone: '',
  email: ''
};

/**
 * AddBusinessPage Component
 * Dedicated page for adding a new business
 */
const AddBusinessPage = () => {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, isAuthenticated]);

  // Custom hooks
  const {
    photos,
    previews,
    error: photoError,
    handlePhotoChange,
    removePhoto,
    reset: resetPhotos
  } = usePhotoUpload();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    // Append form fields
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Append photos
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    await businessService.create(formData);
    setSubmitSuccess(true);

    // Reset and redirect after success
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const form = useForm(initialFormValues, handleSubmit);

  const handleAuthSuccess = () => {
    // User successfully logged in, close modal and show the form
    setShowAuthModal(false);
    // The form will automatically show because isAuthenticated becomes true
  };

  const handleAuthClose = () => {
    // User closed modal without logging in, redirect to home
    setShowAuthModal(false);
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="add-business-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show success message
  if (submitSuccess) {
    return (
      <div className="add-business-page">
        <div className="success-container">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Business Added Successfully!</h2>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-business-page">
      {/* Navigation */}
      <nav className="page-navbar">
        <Link to="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to Home
        </Link>
        {isAuthenticated && (
          <div className="user-info">
            <span className="user-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="page-content">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h1 className="form-title">Add Your Business</h1>
            <p className="form-subtitle">
              Fill in the details below to list your business and reach thousands of potential customers
            </p>
          </div>

          {/* Form */}
          {isAuthenticated ? (
            <BusinessForm
              form={form}
              previews={previews}
              photoError={photoError}
              onPhotoChange={handlePhotoChange}
              onRemovePhoto={removePhoto}
            />
          ) : (
            <div className="auth-required">
              <p>Please sign in to add your business</p>
              <button className="btn-signin" onClick={() => setShowAuthModal(true)}>
                Sign In / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

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

/**
 * Business Form Component
 */
const BusinessForm = ({ form, previews, photoError, onPhotoChange, onRemovePhoto }) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = form;
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }

        if (finalTranscript) {
          setValues((prevValues) => ({
            ...prevValues,
            description: prevValues.description + finalTranscript
          }));
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            setSpeechError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setSpeechError('No microphone found. Please check your device.');
            break;
          case 'not-allowed':
            setSpeechError('Microphone access denied. Please allow microphone access.');
            break;
          default:
            setSpeechError('Error occurred in speech recognition.');
            break;
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [setValues]);

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!recognition) {
      setSpeechError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setSpeechError('');
    } else {
      setSpeechError('');
      recognition.start();
      setIsListening(true);
    }
  };

  // Function to get current location and fill complete address
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data.address) {
            const address = data.address;
            
            // Extract all address components
            const houseNumber = address.house_number || '';
            const road = address.road || address.street || address.pedestrian || '';
            const neighborhood = address.neighbourhood || address.suburb || '';
            const city = address.city || address.town || address.village || address.municipality || '';
            const state = address.state || address.province || '';
            const country = address.country || '';
            
            // Build a comprehensive street address
            let streetAddress = '';
            if (houseNumber) streetAddress += houseNumber;
            if (road) streetAddress += (streetAddress ? ' ' : '') + road;
            if (!road && neighborhood) streetAddress += (streetAddress ? ', ' : '') + neighborhood;
            
            // Set all address fields
            setValues({
              ...values,
              shopNo: houseNumber || '',
              street: streetAddress || road || neighborhood || '',
              city: city || state || '',
              country: country || '',
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              location: data.display_name || ''
            });
            
            setLocationError('');
            
            // Show success message
            console.log('Location detected:', {
              street: streetAddress,
              city: city || state,
              country: country
            });
          }
        } catch (error) {
          console.error('Error getting address:', error);
          setLocationError('Could not retrieve location details. Please enter manually.');
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An error occurred while getting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true, // Request high accuracy GPS
        timeout: 10000,           // 10 second timeout
        maximumAge: 0             // Don't use cached location
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="business-form">
      {/* Business Name & Category */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="businessName" className="form-label">
            Business Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={values.businessName}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <div className="label-with-action">
          <label htmlFor="description" className="form-label">
            Description <span className="required">*</span>
          </label>
          <button
            type="button"
            className={`btn-speech ${isListening ? 'listening' : ''}`}
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Stop speaking' : 'Click to speak'}
          >
            {isListening ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2"></rect>
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                Speak
              </>
            )}
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          className="form-input form-textarea"
          placeholder="Tell us about your business, what makes it special... (or click 'Speak' to use voice input)"
          rows={5}
          required
        />
        {speechError && <div className="speech-error">{speechError}</div>}
        {isListening && (
          <div className="listening-indicator">
            <div className="pulse-dot"></div>
            <span>Listening... Speak now</span>
          </div>
        )}
      </div>

      {/* Address Section Header */}
      <div className="form-section-header">
        <h3 className="section-title">Business Address</h3>
        <button
          type="button"
          className="btn-current-location"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          title="Auto-fill address based on your current GPS location"
        >
          {gettingLocation ? (
            <>
              <span className="location-spinner"></span>
              Detecting Location...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              Use Current Location
            </>
          )}
        </button>
      </div>

      {locationError && <div className="location-error">{locationError}</div>}
      
      {/* Location Helper Text */}
      <div className="location-helper-text">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        Click "Use Current Location" to auto-fill your exact address. You can edit any field afterward.
      </div>

      {/* Shop Number & Street */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="shopNo" className="form-label">
            Shop/Building Number
          </label>
          <input
            type="text"
            id="shopNo"
            name="shopNo"
            value={values.shopNo}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Shop 123, Building A"
          />
        </div>

        <div className="form-group">
          <label htmlFor="street" className="form-label">
            Street Address <span className="required">*</span>
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={values.street}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Main Street, 5th Avenue"
            required
          />
        </div>
      </div>

      {/* City & Country */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city" className="form-label">
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={values.city}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., New York, London"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country" className="form-label">
            Country <span className="required">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={values.country}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., United States, United Kingdom"
            required
          />
        </div>
      </div>

      {/* Phone & Email */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Business Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="form-input"
            placeholder="contact@yourbusiness.com"
            required
          />
        </div>
      </div>

      {/* Location Map Preview - using GPS coordinates or address */}
      <div className="form-group">
        <LocationMap 
          location={values.location || `${values.street}, ${values.city}, ${values.country}`} 
          businessName={values.businessName}
          latitude={values.latitude}
          longitude={values.longitude}
          compact={true}
        />
      </div>

      {/* Photos */}
      <div className="form-group">
        <label className="form-label">
          Photos <span className="photo-limit">(Max 10 photos)</span>
        </label>
        <div className="photo-upload-area">
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={onPhotoChange}
            className="photo-input"
          />
          <label htmlFor="photos" className="photo-upload-label">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="upload-text">Click to upload photos</span>
            <span className="upload-hint">PNG, JPG, GIF up to 10MB each</span>
          </label>
        </div>

        {photoError && <div className="photo-error">{photoError}</div>}

        {previews.length > 0 && (
          <div className="photo-preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="photo-preview-item">
                <img src={preview.preview} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => onRemovePhoto(index)}
                  aria-label="Remove photo"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errors.submit && <div className="form-error">{errors.submit}</div>}

      {/* Submit Button */}
      <button type="submit" className="btn-submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Adding Business...
          </>
        ) : (
          <>
            Add Business
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

export default AddBusinessPage;

