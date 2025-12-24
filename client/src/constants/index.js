/**
 * Business categories
 * Used across the application for consistency
 */
export const CATEGORIES = [
  'Restaurant',
  'Café',
  'Coffee Shop',
  'Retail Store',
  'Grocery Store',
  'Tech Startup',
  'Consulting',
  'Healthcare',
  'Clinic',
  'Hospital',
  'Pharmacy',
  'Education',
  'School',
  'Training Center',
  'Beauty & Spa',
  'Hair Salon',
  'Nail Salon',
  'Barbershop',
  'Fitness',
  'Gym',
  'Yoga Studio',
  'Real Estate',
  'Automotive',
  'Car Repair',
  'Gas Station',
  'Hotel',
  'Law Firm',
  'Accounting',
  'Dentist',
  'Pet Store',
  'Bakery',
  'Bar',
  'Nightclub',
  'Other'
];

/**
 * Popular search terms
 * Shown as suggestions when input is empty
 */
export const POPULAR_SEARCHES = [
  'Restaurant',
  'Coffee Shop',
  'Gym',
  'Hair Salon',
  'Grocery Store'
];

/**
 * Filter options for search
 */
export const FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Restaurants', value: 'Restaurant' },
  { label: 'Retail', value: 'Retail Store' },
  { label: 'Services', value: 'Consulting' },
  { label: 'Tech', value: 'Tech Startup' }
];

/**
 * Form validation rules
 */
export const VALIDATION = {
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters'
  },
  photos: {
    maxCount: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
};

export default {
  CATEGORIES,
  FILTER_OPTIONS,
  VALIDATION
};

