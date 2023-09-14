const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  guildID: String,
  userID: String,
  serviceStartTime: Date,
  totalServiceTime: Number,
  isInService: { type: Boolean, default: false }
});

const model = mongoose.model("User", userSchema);

module.exports = model;