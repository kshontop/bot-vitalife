const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActivityType } = require('discord.js');

module.exports = {
    name: 'setactivity',
    description: '🚑 Permet de modifier l\'activité du bot ',
    default_member_permissions: '8',
    type: ApplicationCommandType.ChatInput,
        options: [
        {
            name: "status",
            description: "Channel for send message",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "activity",
            description: "Channel for send message",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Online",
                    value: "online"
                },
                {
                    name: "Idle",
                    value: "idle"
                },
                {
                    name: "Dnd",
                    value: "dnd",
                },
                {
                    name: "Offline",
                    value: "offline",
                }
            ]
        }
    ],
execute: async (client, interaction, args) => {
    interaction.setCooldown(1000 * 60 * 60);

    const status = interaction.options.getString('status')
    const activity = interaction.options.getString('activity')
    client.user.setPresence({
        status: activity, activities: [{ name: status, type: ActivityType.Playing }],
      });
 
    interaction.reply({embeds: [new EmbedBuilder().setTitle('Status').setDescription(`Le status du bot modifié avec succès `)]})

    }     
}
 

