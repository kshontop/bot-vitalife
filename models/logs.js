const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  guildID: String,
  channelID: String,
});

const model = mongoose.model("ConfigLog", logSchema);

module.exports = model;