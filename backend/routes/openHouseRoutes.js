const express = require('express');
const router = express.Router();
const OpenHouse = require('../models/OpenHouse');
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware'); // Import protect middleware
// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Middleware: Error handler for file uploads
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// POST: Create a new Open House
router.post('/', protect, async (req, res) => {
  const { address, description } = req.body;

  if (!address || !description) {
    return res.status(400).json({ message: 'Address and description are required.' });
  }

  try {
    const newOpenHouse = new OpenHouse({
      address,
      description,
      user: req.user, // Link the Open House to the logged-in user
    });
    await newOpenHouse.save();
    res.status(201).json(newOpenHouse);
  } catch (error) {
    console.error('Error creating Open House:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT: Update an existing Open House
router.put('/:id', async (req, res) => {
  try {
    const updatedOpenHouse = await OpenHouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOpenHouse) {
      return res.status(404).json({ message: 'Open House not found.' });
    }

    res.status(200).json(updatedOpenHouse);
  } catch (error) {
    console.error('Error updating Open House:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Delete an Open House
router.delete('/:id', async (req, res) => {
  try {
    const deletedOpenHouse = await OpenHouse.findByIdAndDelete(req.params.id);

    if (!deletedOpenHouse) {
      return res.status(404).json({ message: 'Open House not found.' });
    }

    res.status(200).json({ message: 'Open House deleted successfully.' });
  } catch (error) {
    console.error('Error deleting Open House:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Save Template for an Open House with Logo Upload
router.put('/:id/template', upload.single('companyLogo'), uploadErrorHandler, async (req, res) => {
  const { contactInfo } = req.body;

  try {
    const openHouse = await OpenHouse.findById(req.params.id);

    if (!openHouse) {
      return res.status(404).json({ message: 'Open House not found' });
    }

    // Construct logo path if a file was uploaded
    const companyLogoPath = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : openHouse.template?.companyLogo; // Keep existing logo if no file uploaded

    // Update the template
    openHouse.template = {
      contactInfo: contactInfo || openHouse.template?.contactInfo,
      companyLogo: companyLogoPath,
      qrCodeLink: `http://localhost:3000/form/${req.params.id}`,
    };

    await openHouse.save();

    res.status(200).json({ message: 'Template saved successfully', openHouse });
  } catch (error) {
    console.error('Error saving template:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Fetch all Open Houses for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const openHouses = await OpenHouse.find({ user: req.user }); // Fetch only user's Open Houses
    res.status(200).json(openHouses);
  } catch (error) {
    console.error('Error fetching Open Houses:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET: Fetch a Single Open House by ID
router.get('/:id', async (req, res) => {
  try {
    const openHouse = await OpenHouse.findById(req.params.id);

    if (!openHouse) {
      return res.status(404).json({ message: 'Open House not found' });
    }

    res.status(200).json(openHouse);
  } catch (error) {
    console.error('Error fetching Open House:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT: Update an Open House (validate ownership)
router.put('/:id', protect, async (req, res) => {
  const { address, description } = req.body;

  try {
    const openHouse = await OpenHouse.findById(req.params.id);

    if (!openHouse) {
      return res.status(404).json({ message: 'Open House not found.' });
    }

    // Check ownership
    if (openHouse.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to update this Open House.' });
    }

    openHouse.address = address || openHouse.address;
    openHouse.description = description || openHouse.description;

    const updatedOpenHouse = await openHouse.save();
    res.status(200).json(updatedOpenHouse);
  } catch (error) {
    console.error('Error updating Open House:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// DELETE: Delete an Open House (validate ownership)
router.delete('/:id', protect, async (req, res) => {
  try {
    const openHouse = await OpenHouse.findById(req.params.id);

    if (!openHouse) {
      return res.status(404).json({ message: 'Open House not found.' });
    }

    // Check ownership
    if (openHouse.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to delete this Open House.' });
    }

    await openHouse.remove();
    res.status(200).json({ message: 'Open House deleted successfully.' });
  } catch (error) {
    console.error('Error deleting Open House:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update template for an Open House
router.put('/:id/template', protect, async (req, res) => {
  const { contactInfo, companyLogo, qrCodeLink } = req.body;

  try {
    const openHouse = await OpenHouse.findById(req.params.id);

    if (!openHouse) {
      return res.status(404).json({ message: 'Open House not found.' });
    }

    // Check ownership
    if (openHouse.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to edit this template.' });
    }

    // Update template fields
    openHouse.template = { contactInfo, companyLogo, qrCodeLink };
    const updatedOpenHouse = await openHouse.save();

    res.status(200).json(updatedOpenHouse);
  } catch (error) {
    console.error('Error updating template:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
