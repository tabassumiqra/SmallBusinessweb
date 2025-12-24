import express from 'express';
import { exampleController } from '../controllers/index.js';

const router = express.Router();

/**
 * @route   GET /api/examples
 * @desc    Get all examples
 * @access  Public
 */
router.get('/', exampleController.getAllExamples);

/**
 * @route   GET /api/examples/:id
 * @desc    Get example by ID
 * @access  Public
 */
router.get('/:id', exampleController.getExampleById);

/**
 * @route   POST /api/examples
 * @desc    Create a new example
 * @access  Public
 */
router.post('/', exampleController.createExample);

/**
 * @route   PUT /api/examples/:id
 * @desc    Update example
 * @access  Public
 */
router.put('/:id', exampleController.updateExample);

/**
 * @route   DELETE /api/examples/:id
 * @desc    Delete example
 * @access  Public
 */
router.delete('/:id', exampleController.deleteExample);

export default router;

