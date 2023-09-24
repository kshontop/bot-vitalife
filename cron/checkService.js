const cron = require('node-cron');
const users = require('../models/users');
const channels = require('../models/service');

function startServiceCheck(client) {
  cron.schedule('*/5 * * * *', async() => {
    const usersInService = await users.find({ isInService: true });
    for(const userData of usersInService) {
      const chan = await channels.findOne({ guildID: userData.guildID })
      const currentTime = new Date();
      const serviceTime = currentTime - userData.serviceStartTime;
  
      if(serviceTime >= 2 * 60 * 60 * 1000) {
        userData.isInService = false;
        userData.totalServiceTime += serviceTime;
        await userData.save();
  
        const user = await client.users.fetch(userData.userID);
        if(user) {
          try {
            await user.send(`Il semblerait que vous ayez été en service pendant 2 heures. Pour éviter tout abus, votre prise de service a été automatiquement désactivée. Vous pouvez la réactiver en vous rendant dans le salon <#${chan.channelID}>`)
          } catch(e) {

          }
        }
      }
    }
  })
}

module.exports = startServiceCheck;