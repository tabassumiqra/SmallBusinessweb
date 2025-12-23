import { useState } from 'react';
import './AddBusiness.css';

const AddBusiness = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    website: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Business data:', formData);
    // Add your form submission logic here
    alert('Business added successfully!');
    // Reset form
    setFormData({
      businessName: '',
      category: '',
      description: '',
      location: '',
      phone: '',
      email: '',
      website: ''
    });
    setIsExpanded(false);
  };

  const categories = [
    'Restaurant',
    'Retail Store',
    'Tech Startup',
    'Consulting',
    'Healthcare',
    'Education',
    'Beauty & Spa',
    'Fitness',
    'Real Estate',
    'Other'
  ];

  return (
    <div className="add-business-container">
      <div className={`add-business-card ${isExpanded ? 'expanded' : ''}`}>
        {!isExpanded ? (
          <div className="add-business-preview" onClick={() => setIsExpanded(true)}>
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
            <div className="form-header">
              <h3 className="form-title">Add Your Business</h3>
              <button 
                className="close-button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close form"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-business-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName" className="form-label">
                    Business Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
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
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="Tell us about your business..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="City, State or Address"
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
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="business@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setIsExpanded(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <span>Add Business</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBusiness;

