const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  guildID: String,
  channelID: String,
});

const model = mongoose.model("ServiceChannel", serviceSchema);

module.exports = model;