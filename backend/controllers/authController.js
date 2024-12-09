const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new Agent({ email, password: hashedPassword });
    await newAgent.save();
    res.status(201).json({ message: 'Agent registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
