const colors = require('colors');
const { ActivityType} = require('discord.js');
const { default: mongoose, mongo } = require('mongoose');
const config = require ("../../config.json");

module.exports = {
	name: 'ready',
	once: false,
execute: async (client) => {
    await mongoose.connect(config.mongodb || '', {
        keepAlive: true,
    });

    if (mongoose.connect)
    console.log('[MongoDB] '.bold.green + `La connexion est réussie.`.bold.white)
    console.log('[API] '.bold.green + `Connected to Discord.`.bold.white)

    }
}
