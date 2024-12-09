const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization'); // Fetch token from the header
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const splitToken = token.split(' ')[1]; // Extract the actual token after "Bearer"
    const verified = jwt.verify(splitToken, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to the request
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};
