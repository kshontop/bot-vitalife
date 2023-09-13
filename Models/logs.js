const { Schema, model } = require('mongoose');

const logs = new Schema({
    guildID: String,
    ChannelID: String
})

module.exports = model("logs", logs);