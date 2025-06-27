const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:{type:String},
  freshdeskApiKey: { type: String },
  freshdeskDomain: { type: String },
  hubspotToken: { type: String },
  freshdeskStatus: { type: String, default: 'notverified' },
  hubspotStatus: { type: String, default: 'notverified' }
});

module.exports = mongoose.model('User', userSchema); 