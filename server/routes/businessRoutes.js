import express from 'express';
import { businessController } from '../controllers/index.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

/**
 * @route   GET /api/businesses/search
 * @desc    Search businesses
 * @access  Public
 */
router.get('/search', businessController.searchBusinesses);

/**
 * @route   GET /api/businesses
 * @desc    Get all businesses
 * @access  Public
 */
router.get('/', businessController.getAllBusinesses);

/**
 * @route   GET /api/businesses/:id
 * @desc    Get business by ID
 * @access  Public
 */
router.get('/:id', businessController.getBusinessById);

/**
 * @route   POST /api/businesses
 * @desc    Create a new business
 * @access  Private
 */
router.post('/', authenticate, upload.array('photos', 10), businessController.createBusiness);

/**
 * @route   PUT /api/businesses/:id
 * @desc    Update business
 * @access  Private
 */
router.put('/:id', authenticate, businessController.updateBusiness);

/**
 * @route   DELETE /api/businesses/:id
 * @desc    Delete business
 * @access  Private
 */
router.delete('/:id', authenticate, businessController.deleteBusiness);

export default router;

