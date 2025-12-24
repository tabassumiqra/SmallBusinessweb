import { formatFileResponse } from '../utils/index.js';

/**
 * @desc    Upload single file
 * @route   POST /api/upload
 * @access  Public
 */
export const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    message: 'File uploaded successfully',
    file: formatFileResponse(req.file)
  });
};

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/multiple
 * @access  Public
 */
export const uploadMultiple = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const files = req.files.map(formatFileResponse);

  res.json({
    message: 'Files uploaded successfully',
    files
  });
};

