const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { Parser } = require('json2csv'); // For exporting JSON to CSV

// 1. POST: Create a Visitor
router.post('/submit', async (req, res) => {
  const { openHouseId, name, email, phone, feedback } = req.body;

  try {
    // Validate required fields
    if (!openHouseId || !name || !email) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Save new visitor
    const newVisitor = new Visitor({
      openHouseId,
      name,
      email,
      phone,
      feedback,
    });

    await newVisitor.save();
    res.status(201).json({ message: 'Visitor created successfully', visitor: newVisitor });
  } catch (error) {
    console.error('Error creating visitor:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. GET: Fetch all visitors for a specific Open House
router.get('/:openHouseId', async (req, res) => {
  try {
    const { openHouseId } = req.params;

    // Find visitors by openHouseId
    const visitors = await Visitor.find({ openHouseId });
    res.status(200).json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. PUT: Update a specific visitor
router.put('/:visitorId', async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.visitorId,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedVisitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }

    res.status(200).json({ message: 'Visitor updated successfully', visitor: updatedVisitor });
  } catch (error) {
    console.error('Error updating visitor:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 4. DELETE: Delete a specific visitor
router.delete('/:visitorId', async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.visitorId);

    if (!deletedVisitor) {
      return res.status(404).json({ message: 'Visitor not found.' });
    }

    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 5. GET: Export all visitors for a specific Open House as CSV
router.get('/:openHouseId/export', async (req, res) => {
  try {
    const { openHouseId } = req.params;

    // Find visitors by openHouseId
    const visitors = await Visitor.find({ openHouseId });

    if (!visitors || visitors.length === 0) {
      return res.status(404).json({ message: 'No visitors found for this Open House.' });
    }

    // Convert JSON to CSV
    const fields = ['name', 'email', 'phone', 'feedback', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(visitors);

    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment('visitors.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting visitors:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
