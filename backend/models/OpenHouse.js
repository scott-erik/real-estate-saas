const mongoose = require('mongoose');

const OpenHouseSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  address: String,
  description: String,
  formLink: String,
  template: {
    contactInfo: { type: String },
    companyLogo: { type: String }, // Store URL to the uploaded logo
    qrCodeLink: { type: String },
  },
  visitors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' }],
});

module.exports = mongoose.model('OpenHouse', OpenHouseSchema);
