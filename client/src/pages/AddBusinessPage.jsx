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
  location: '',
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
  const { values, errors, isSubmitting, handleChange, handleSubmit } = form;

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
        <label htmlFor="description" className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          className="form-input form-textarea"
          placeholder="Tell us about your business, what makes it special..."
          rows={5}
          required
        />
      </div>

      {/* Location & Phone */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location" className="form-label">
            Location <span className="required">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={values.location}
            onChange={handleChange}
            className="form-input"
            placeholder="City, State or Full Address"
            required
          />
        </div>

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
      </div>

      {/* Location Map Preview */}
      <div className="form-group">
        <LocationMap location={values.location} businessName={values.businessName} />
      </div>

      {/* Email */}
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

