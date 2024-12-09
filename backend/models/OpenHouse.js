const mongoose = require('mongoose');

const OpenHouseSchema = new mongoose.Schema({
  address: { type: String, required: true },
  description: { type: String, required: true },
  template: {
    contactInfo: { type: String },
    companyLogo: { type: String },
    qrCodeLink: { type: String },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OpenHouse', OpenHouseSchema);
