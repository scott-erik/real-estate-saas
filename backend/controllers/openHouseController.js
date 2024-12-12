const CLIENT_URL = process.env.CLIENT_URL || 'https://yourapp.com';

exports.createOpenHouse = async (req, res) => {
  const { address, description } = req.body;

  try {
    const newOpenHouse = new OpenHouse({
      agentId: req.user.id,
      address,
      description,
    });

    await newOpenHouse.save();

    // Generate the correct QR code link
    newOpenHouse.formLink = `${CLIENT_URL}/form/${newOpenHouse._id}`;

    await newOpenHouse.save();

    res.status(201).json(newOpenHouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
