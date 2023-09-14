const config = require("../../config.json");
const mongoose = require('mongoose');

module.exports = {
  name: 'ready',
  once: false,
  execute: async (client) => {

    console.log(client.user.username)
    await mongoose.connect(config.mongodb, {
      keepAlive: true
    });

    if(mongoose.connect) {
      console.log(`[Mongoose]`.bold.green + ` Base de données connecté avec succès`.bold.white);
    }
  }
}