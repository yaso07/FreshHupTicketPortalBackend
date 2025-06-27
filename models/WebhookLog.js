const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  eventType: { type: String, required: true },
  payload: { type: Object, required: true }
});

module.exports = mongoose.model('WebhookLog', webhookLogSchema); 