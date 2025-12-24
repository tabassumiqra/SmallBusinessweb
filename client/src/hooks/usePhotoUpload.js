import { useState, useCallback } from 'react';
import { VALIDATION } from '../constants';

/**
 * Custom hook for handling photo uploads
 * @param {number} maxPhotos - Maximum number of photos allowed
 * @returns {object} Photo state and handlers
 */
export const usePhotoUpload = (maxPhotos = VALIDATION.photos.maxCount) => {
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  const handlePhotoChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setError('');

    // Check max photos limit
    if (files.length + photos.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !VALIDATION.photos.allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setError('Only image files are allowed');
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(
      (file) => file.size > VALIDATION.photos.maxSize
    );
    if (oversizedFiles.length > 0) {
      setError('Some files exceed the 10MB size limit');
      return;
    }

    // Add new photos
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [
          ...prev,
          {
            file,
            preview: reader.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  }, [photos, maxPhotos]);

  const removePhoto = useCallback((index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setError('');
  }, []);

  const reset = useCallback(() => {
    setPhotos([]);
    setPreviews([]);
    setError('');
  }, []);

  return {
    photos,
    previews,
    error,
    handlePhotoChange,
    removePhoto,
    reset
  };
};

export default usePhotoUpload;

