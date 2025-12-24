import express from 'express';
import { uploadController } from '../controllers/index.js';
import upload from '../config/multer.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload single file
 * @access  Public
 */
router.post('/', upload.single('file'), uploadController.uploadSingle);

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple files
 * @access  Public
 */
router.post('/multiple', upload.array('files', 10), uploadController.uploadMultiple);

export default router;

