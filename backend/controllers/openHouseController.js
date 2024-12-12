const OpenHouse = require('../models/OpenHouse');

exports.createOpenHouse = async (req, res) => {
  const { address, description } = req.body;

  try {
    // Create a new Open House document
    const newOpenHouse = new OpenHouse({
      agentId: req.user.id,
      address,
      description,
    });

    // Save the new Open House to generate the `_id`
    await newOpenHouse.save();

    // Update the formLink with the Open House's _id
    newOpenHouse.formLink = `https://yourapp.com/form/${newOpenHouse._id}`;

    // Save the updated Open House with the formLink
    await newOpenHouse.save();

    res.status(201).json(newOpenHouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
