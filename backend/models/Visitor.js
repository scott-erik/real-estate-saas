const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  openHouseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'OpenHouse' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  feedback: { type: String },
  customFields: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visitor', visitorSchema);
