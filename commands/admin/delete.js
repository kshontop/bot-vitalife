const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActivityType } = require('discord.js');
const logs = require('../../models/users.js');

module.exports = {
    name: 'delete',
    description: '⛽ Permet de supprimer les heures total d\'un utilisateur',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: '8',
        options: [
        {
            name: "user",
            description: "Mentionne l'utilisateur",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {

      const users = interaction.options.getUser('user');

      const dataUser = await logs.findOne({ userID: users.id, guildID: interaction.guild.id });
      if(!dataUser) return interaction.reply({embeds: [new EmbedBuilder().setDescription('L\'utilisateur mentionné n\'a pas encore effectué de service.')]})

      dataUser.totalServiceTime = 0;
      
      await dataUser.save();
      interaction.reply({content: `Le temps de service total à été supprimé pour l'utilisateur ${users}`, components: []})
    }     
}
 

