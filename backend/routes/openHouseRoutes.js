const express = require('express');
const router = express.Router();
const OpenHouse = require('../models/OpenHouse');
const multer = require('multer');
const path = require('path');

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

// GET: Fetch all Open Houses
router.get('/', async (req, res) => {
  try {
    const openHouses = await OpenHouse.find();
    res.status(200).json(openHouses);
  } catch (error) {
    console.error('Error fetching open houses:', error.message);
    res.status(500).json({ message: 'Failed to fetch open houses' });
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

module.exports = router;
