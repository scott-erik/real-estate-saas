const mongoose = require('mongoose');

const openHouseSchema = new mongoose.Schema({
  address: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customFields: { type: [String], default: [] },
  template: {
    contactInfo: String,
    companyLogo: String,
    qrCodeLink: String,
  },
  visitors: [
    {
      name: String,
      email: String,
      phone: String,
      feedback: String,
      customFields: Object, // Key-value pairs for custom fields
      submittedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('OpenHouse', openHouseSchema);
