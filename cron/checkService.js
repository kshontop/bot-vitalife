const cron = require('node-cron');
const Discord = require("discord.js");
const users = require('../models/users');
const channels = require('../models/service');
const logsData = require('../models/logs.js');

function startServiceCheck(client) {
  cron.schedule('*/2 * * * *', async () => {
    const usersInService = await users.find({ isInService: true });
    for (const userData of usersInService) {
      const chan = await channels.findOne({ guildID: userData.guildID });
      const currentTime = new Date();
      const serviceTime = currentTime - userData.serviceStartTime;

      if (serviceTime >= 2 * 60 * 60 * 1000) {
        userData.isInService = false;
        userData.totalServiceTime += serviceTime;
        await userData.save();

        const user = await client.users.fetch(userData.userID);
        if (user) {
          try {
            await user.send(`Il semblerait que vous ayez été en service pendant 2 heures. Pour éviter tout abus, votre prise de service a été automatiquement désactivée. Vous pouvez la réactiver en vous rendant dans le salon <#${chan.channelID}>`);
            const userDatas = await users.findOne({ guildID: userData.guildID, userID: userData.userID });

            if (userData) {
              const serviceHours = Math.floor(serviceTime / 3600000);
              const serviceMinutes = Math.floor((serviceTime % 3600000) / 60000);
              const serviceSeconds = Math.floor((serviceTime % 60000) / 1000);
              const now = new Date();
              const options = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' };
              const formattedTime = now.toLocaleTimeString('fr-FR', options);

              const totalServiceHours = Math.floor(userDatas.totalServiceTime / 3600000);
              const totalServiceMinutes = Math.floor((userDatas.totalServiceTime % 3600000) / 60000);
              const totalServiceSeconds = Math.floor((userDatas.totalServiceTime % 60000) / 1000);

              const totalFormat = `${totalServiceHours}h${totalServiceMinutes}m${totalServiceSeconds}s`;

              const formattedTime2 = `${serviceHours}h ${serviceMinutes}m ${serviceSeconds}s`;

              const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `Fin de service`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128' })
                .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
                .setColor('Red')
                .addFields(
                  { name: `Agent`, value: `<@${userDatas.userID}>` },
                  { name: `Heure`, value: `${formattedTime}` },
                  { name: `Temps de service:`, value: `${formattedTime2}` },
                  { name: `Temps total en service:`, value: `${totalFormat}` }
                )
                .setFooter({ text: `Fin de service - EMS ` });

                let cl = await logsData.findOne({ guildID: userData.guildID })
                let canal = client.channels.resolve(cl.channelID);
                if(canal) {
                  canal.send({ embeds: [embed] });
                }
                
            }
          } catch (error) {
            console.error("Une erreur s'est produite :", error);
          }
        }
      }
    }
  });
}

module.exports = startServiceCheck;
