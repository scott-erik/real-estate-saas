const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const OpenHouse = require('../models/OpenHouse');

// Fetch all open houses for the logged-in agent
router.get('/', authMiddleware, async (req, res) => {
  try {
    const openHouses = await OpenHouse.find({ agentId: req.user.id });
    res.json(openHouses);
  } catch (error) {
    console.error('Error fetching open houses:', error.message);
    res.status(500).json({ message: 'Failed to fetch open houses' });
  }
});

module.exports = router;
