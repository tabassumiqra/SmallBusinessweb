import Business from '../models/Business.js';
import { formatBusinessResponse, formatFileResponse } from '../utils/index.js';

/**
 * @desc    Create a new business
 * @route   POST /api/businesses
 * @access  Private
 */
export const createBusiness = async (req, res) => {
  try {
    const { businessName, category, description, location, phone, email } = req.body;

    // Validate required fields
    if (!businessName || !category || !description || !location || !email) {
      return res.status(400).json({
        error: 'Missing required fields: businessName, category, description, location, email'
      });
    }

    // Prepare photos array
    const photos = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size
        }))
      : [];

    // Create business
    const business = new Business({
      businessName,
      category,
      description,
      location,
      phone: phone || '',
      email,
      photos,
      userId: req.user._id
    });

    await business.save();

    res.status(201).json({
      message: 'Business added successfully',
      business: formatBusinessResponse(business)
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Get all businesses
 * @route   GET /api/businesses
 * @access  Public
 */
export const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json(businesses.map(formatBusinessResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get business by ID
 * @route   GET /api/businesses/:id
 * @access  Public
 */
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(formatBusinessResponse(business));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update business
 * @route   PUT /api/businesses/:id
 * @access  Private
 */
export const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check ownership
    if (business.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this business' });
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Business updated successfully',
      business: formatBusinessResponse(updatedBusiness)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Delete business
 * @route   DELETE /api/businesses/:id
 * @access  Private
 */
export const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check ownership
    if (business.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this business' });
    }

    await Business.findByIdAndDelete(req.params.id);

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Search businesses with fuzzy matching
 * @route   GET /api/businesses/search
 * @access  Public
 */
export const searchBusinesses = async (req, res) => {
  try {
    const { q, category, location } = req.query;
    let businesses = [];

    if (q || category || location) {
      const query = {};

      // Build search query
      if (q && q.trim()) {
        // Use $or to search across multiple fields with fuzzy matching
        query.$or = [
          { businessName: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { location: { $regex: q, $options: 'i' } }
        ];
      }

      if (category && category.trim()) {
        query.category = { $regex: category, $options: 'i' };
      }

      if (location && location.trim()) {
        query.location = { $regex: location, $options: 'i' };
      }

      businesses = await Business.find(query).sort({ createdAt: -1 }).populate('userId', 'name email');
    } else {
      // No search parameters, return all businesses
      businesses = await Business.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    }

    res.json({
      count: businesses.length,
      businesses: businesses.map(formatBusinessResponse)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
};

