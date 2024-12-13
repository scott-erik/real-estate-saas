// const CLIENT_URL = process.env.CLIENT_URL || 'https://yourapp.com';
const OpenHouse = require('../models/OpenHouse');
exports.createOpenHouse = async (req, res) => {
  const { address, description } = req.body;

  try {
    const newOpenHouse = new OpenHouse({
      agentId: req.user.id,
      address,
      description,
    });

    await newOpenHouse.save();

     // Generate the formLink using the unique _id
     const CLIENT_URL = process.env.CLIENT_URL || 'https://real-estate-saas-front.onrender.com';
     newOpenHouse.template = {
       qrCodeLink: `${CLIENT_URL}/openhouses/${newOpenHouse._id}/visitorform`,
     };

    await newOpenHouse.save();

    res.status(201).json(newOpenHouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
