import Example from '../models/Example.js';

/**
 * @desc    Create a new example
 * @route   POST /api/examples
 * @access  Public
 */
export const createExample = async (req, res) => {
  try {
    const example = new Example(req.body);
    await example.save();
    res.status(201).json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Get all examples
 * @route   GET /api/examples
 * @access  Public
 */
export const getAllExamples = async (req, res) => {
  try {
    const examples = await Example.find();
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get example by ID
 * @route   GET /api/examples/:id
 * @access  Public
 */
export const getExampleById = async (req, res) => {
  try {
    const example = await Example.findById(req.params.id);
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update example
 * @route   PUT /api/examples/:id
 * @access  Public
 */
export const updateExample = async (req, res) => {
  try {
    const example = await Example.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Delete example
 * @route   DELETE /api/examples/:id
 * @access  Public
 */
export const deleteExample = async (req, res) => {
  try {
    const example = await Example.findByIdAndDelete(req.params.id);
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json({ message: 'Example deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

