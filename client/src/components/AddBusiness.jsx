import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { businessService } from '../services';
import { useForm, usePhotoUpload } from '../hooks';
import { CATEGORIES } from '../constants';
import AuthModal from './AuthModal';
import './AddBusiness.css';

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
 * AddBusiness Component
 * Allows authenticated users to add their business
 */
const AddBusiness = () => {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use custom hooks
  const { photos, previews, error: photoError, handlePhotoChange, removePhoto, reset: resetPhotos } = usePhotoUpload();

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
    alert('Business added successfully!');
    
    // Reset form
    form.reset();
    resetPhotos();
    setIsExpanded(false);
  };

  const form = useForm(initialFormValues, handleSubmit);

  const handleCardClick = () => {
    if (isAuthenticated) {
      setIsExpanded(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    form.reset();
    resetPhotos();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsExpanded(true);
  };

  return (
    <div className="add-business-container">
      <div className={`add-business-card ${isExpanded ? 'expanded' : ''}`}>
        {!isExpanded ? (
          <div className="add-business-preview" onClick={handleCardClick}>
            <div className="preview-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <div className="preview-content">
              <h3 className="preview-title">Add Your Business</h3>
              <p className="preview-description">
                Join our community and showcase your business to thousands of potential customers
              </p>
            </div>
            <div className="preview-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="add-business-form-container">
            <FormHeader onClose={handleClose} />
            <BusinessForm
              form={form}
              previews={previews}
              photoError={photoError}
              onPhotoChange={handlePhotoChange}
              onRemovePhoto={removePhoto}
              onCancel={handleClose}
            />
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

/**
 * Form Header Component
 */
const FormHeader = ({ onClose }) => (
  <div className="form-header">
    <h3 className="form-title">Add Your Business</h3>
    <button className="close-button" onClick={onClose} aria-label="Close form">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
);

/**
 * Business Form Component
 */
const BusinessForm = ({ form, previews, photoError, onPhotoChange, onRemovePhoto, onCancel }) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="add-business-form">
      <div className="form-row">
        <FormInput
          label="Business Name"
          name="businessName"
          value={values.businessName}
          onChange={handleChange}
          placeholder="Enter your business name"
          required
        />
        <FormSelect
          label="Category"
          name="category"
          value={values.category}
          onChange={handleChange}
          options={CATEGORIES}
          required
        />
      </div>

      <FormTextarea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="Tell us about your business..."
        rows={4}
        required
      />

      <div className="form-row">
        <FormInput
          label="Location"
          name="location"
          value={values.location}
          onChange={handleChange}
          placeholder="City, State or Address"
          required
        />
        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
        />
      </div>

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        placeholder="business@example.com"
        required
      />

      <PhotoUpload
        previews={previews}
        error={photoError}
        onChange={onPhotoChange}
        onRemove={onRemovePhoto}
      />

      {errors.submit && <div className="form-error">{errors.submit}</div>}

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Adding...' : 'Add Business'}</span>
          {!isSubmitting && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * Form Input Component
 */
const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

/**
 * Form Select Component
 */
const FormSelect = ({ label, name, value, onChange, options, required }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input"
      required={required}
    >
      <option value="">Select a category</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Form Textarea Component
 */
const FormTextarea = ({ label, name, value, onChange, placeholder, rows, required }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input form-textarea"
      placeholder={placeholder}
      rows={rows}
      required={required}
    />
  </div>
);

/**
 * Photo Upload Component
 */
const PhotoUpload = ({ previews, error, onChange, onRemove }) => (
  <div className="form-group">
    <label htmlFor="photos" className="form-label">
      Photos <span className="photo-limit">(Max 10 photos)</span>
    </label>
    <div className="photo-upload-container">
      <input
        type="file"
        id="photos"
        name="photos"
        accept="image/*"
        multiple
        onChange={onChange}
        className="photo-input"
      />
      <label htmlFor="photos" className="photo-upload-label">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span>Choose Photos</span>
      </label>
    </div>

    {error && <div className="photo-error">{error}</div>}

    {previews.length > 0 && (
      <div className="photo-preview-grid">
        {previews.map((preview, index) => (
          <div key={index} className="photo-preview-item">
            <img src={preview.preview} alt={`Preview ${index + 1}`} />
            <button
              type="button"
              className="remove-photo-btn"
              onClick={() => onRemove(index)}
              aria-label="Remove photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AddBusiness;
