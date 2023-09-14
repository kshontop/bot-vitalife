const { ApplicationCommandType, Colors, ButtonBuilder,EmbedBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const userDatas = require('../../models/users.js');

module.exports = {
    name: 'leaderboard',
    description: '🚑 Permet d\'afficher les services de tout les EMS',
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: '8',
    execute: async (client, interaction, args) => {
     
      const users = await userDatas.find();

      users.sort((a, b) => b.totalServiceTime - a.totalServiceTime);
      const usersPerPage = 15;
      const totalPages = Math.ceil(users.length / usersPerPage)

      let page = 1;
      let offset = 0;
      let startIndex = (page - 1) * usersPerPage;
      let endIndex = startIndex + usersPerPage;
      let usersToShow = users.slice(startIndex, endIndex);

      const userNames = await Promise.all(
        usersToShow.map(async (user) => {
          const member = await interaction.guild.members.fetch(user.userID);
          return member ? member.user : `${user.userID}`;
        })
      );

      const description = userNames.map((userName, index) => {
        const user = usersToShow[index];

        const totalServiceHours = Math.floor(user.totalServiceTime / 3600000);
        const totalServiceMinutes = Math.floor((user.totalServiceTime % 3600000) / 60000);
        const totalServiceSeconds = Math.floor((user.totalServiceTime % 60000) / 1000);
        const totalFormat = `${totalServiceHours} heures ${totalServiceMinutes} minutes ${totalServiceSeconds} secondes`

        return `- ${userName} - Temps de service : \`${totalFormat}\``;
      });
      
      const embed = new EmbedBuilder()
      .setTitle(`Leaderboard prise de service`)
      .setDescription(`${description.join('\n')}`)
      .setColor('Green')

      const components = totalPages > 1
      ? [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('previous-pds')
              .setLabel('Précédent')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('next-pds')
              .setLabel('Suivant')
              .setStyle(ButtonStyle.Primary)
          )
      ]
      : [];

      const messageSent = await interaction.reply({ embeds: [embed], components });

      const filter = i => (i.customId === 'previous-pds' || i.customId === 'next-pds') && i.user.id === interaction.user.id;
      const collector = messageSent.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async interaction => {
        if (interaction.customId === 'previous-pds') {
          page--;
          if (page < 1) {
            page = totalPages;
          }
        } else if (interaction.customId === 'next-pds') {
          page++;
          if (page > totalPages) {
            page = 1;
          }
        }

        startIndex = (page - 1) * usersPerPage;
        endIndex = startIndex + usersPerPage;
        usersToShow = users.slice(startIndex, endIndex);
      
        offset = (page - 1) * usersPerPage;


        const userNames = await Promise.all(
          usersToShow.map(async (user) => {
            const member = await interaction.guild.members.fetch(user.userID);
            return member ? member.user : `${user.userID}`;
          })
        );
  
        const description = userNames.map((userName, index) => {
          const user = usersToShow[index];
  
          const totalServiceHours = Math.floor(user.totalServiceTime / 3600000);
          const totalServiceMinutes = Math.floor((user.totalServiceTime % 3600000) / 60000);
          const totalServiceSeconds = Math.floor((user.totalServiceTime % 60000) / 1000);
          const totalFormat = `${totalServiceHours} heures ${totalServiceMinutes} minutes ${totalServiceSeconds} secondes`
  
          return `- ${userName} - Temps de service : \`${totalFormat}\``;
        });
      
        embed.setDescription(`${description.join('\n')}`)

        await interaction.update({ embeds: [embed] });
      })

      collector.on('end', async () => {
        await messageSent.edit({ components: [] }).catch(() => {});
      })
    }     
}