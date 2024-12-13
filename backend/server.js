const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/openhouses', require('./routes/openHouseRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all route to serve React index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
