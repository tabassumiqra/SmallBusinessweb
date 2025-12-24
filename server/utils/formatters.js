/**
 * Format user object for API response
 * Removes sensitive data like password
 * @param {object} user - User document from database
 * @returns {object} Formatted user object
 */
export const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar
  };
};

/**
 * Format business object for API response
 * @param {object} business - Business document from database
 * @returns {object} Formatted business object
 */
export const formatBusinessResponse = (business) => {
  return {
    id: business._id,
    businessName: business.businessName,
    category: business.category,
    description: business.description,
    location: business.location,
    phone: business.phone,
    email: business.email,
    photos: business.photos,
    userId: business.userId,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt
  };
};

/**
 * Format file upload response
 * @param {object} file - Multer file object
 * @returns {object} Formatted file object
 */
export const formatFileResponse = (file) => {
  return {
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    path: file.path
  };
};

