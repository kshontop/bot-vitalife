const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActivityType } = require('discord.js');
const logs = require('../../models/users.js');

module.exports = {
    name: 'find',
    description: '⛽ Permet de consulter les temps de services d\'un employé',
    type: ApplicationCommandType.ChatInput,
        options: [
        {
            name: "user",
            description: "user time",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {

      const users = interaction.options.getUser('user');

      const dataUser = await logs.findOne({ userID: users.id, guildID: interaction.guild.id });
      if(!dataUser) return interaction.reply({embeds: [new EmbedBuilder().setDescription('L\'utilisateur mentionné n\'a pas encore effectué de service.')]})

      const totalServiceHours = Math.floor(dataUser.totalServiceTime / 3600000);
      const totalServiceMinutes = Math.floor((dataUser.totalServiceTime % 3600000) / 60000);
      const totalServiceSeconds = Math.floor((dataUser.totalServiceTime % 60000) / 1000);
      const totalFormat = `${totalServiceHours} heures ${totalServiceMinutes} minutes ${totalServiceSeconds} secondes`
      const match = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle(`${users.globalName}`)
      .setDescription(`Le temps de service total s'élève à **${totalFormat}**`)
      interaction.reply({embeds: [match], components: []})
    }     
}
 

