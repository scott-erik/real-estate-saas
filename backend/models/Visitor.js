const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  openHouseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'OpenHouse',
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  feedback: { type: String },
});

module.exports = mongoose.model('Visitor', VisitorSchema);
