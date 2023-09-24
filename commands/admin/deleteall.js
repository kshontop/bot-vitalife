const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActivityType } = require('discord.js');
const logs = require('../../models/users.js');

module.exports = {
    name: 'deleteall',
    description: '⛽ Permet de supprimer les heures total de tout les utilisateurs',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: '8',
        options: [
        {
            name: "guild",
            description: "id du serveur",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {

      const guild = interaction.options.getString('guild');
    
      const result = await logs.updateMany(
        { guildID: guild },
        { $set: { totalServiceTime: 0 } }
      ).then(() => {
        interaction.reply(`La mise à jour de totalServiceTime pour les utilisateurs du serveur ${guild} a été effectuée avec succès.`);
      }).catch(() => {
        interaction.reply('test')
      });
    
    }     
}
 

