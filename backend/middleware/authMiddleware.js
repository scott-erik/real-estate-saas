const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // Attach the user's ID to the request
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = protect;
