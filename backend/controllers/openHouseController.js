const OpenHouse = require('../models/OpenHouse');

exports.createOpenHouse = async (req, res) => {
  const { address, description } = req.body;
  const formLink = `https://yourapp.com/form/${Date.now()}`; // Temporary link generator
  const newOpenHouse = new OpenHouse({ agentId: req.user.id, address, description, formLink });
  try {
    await newOpenHouse.save();
    res.status(201).json(newOpenHouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
