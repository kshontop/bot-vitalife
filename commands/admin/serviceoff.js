const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActivityType } = require('discord.js');
const logs = require('../../models/users.js');

module.exports = {
    name: 'serviceoff',
    description: '⛽ Permet de mettre tout les utilisateurs en fin de service',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: '8',

execute: async (client, interaction, args) => {

  
      const membersBeforeUpdate = await logs.find(
        { guildID: interaction.guild.id, isInService: true }
      );
      const updateResult = await logs.updateMany(
        { guildID: interaction.guild.id, isInService: true },
        { $set: { isInService: false } }
      );

      if(updateResult.modifiedCount > 0) {
        const memberIDsBeforeUpdate = membersBeforeUpdate.map((member) => member.userID);

        console.log('Membres affectés avant la mise à jour :', memberIDsBeforeUpdate);
        interaction.reply(`Membres mis en mode hors service : ${memberIDsBeforeUpdate.join(', ')}`);
      } else {
        interaction.reply(`Aucun membre n\'a été mis en mode hors service.`);
      }
    
    }     
}
 

