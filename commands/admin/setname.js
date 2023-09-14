const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'setname',
    description: '🚑 Permet de modifier le nom du bot.',
    default_member_permissions: '8',
    type: ApplicationCommandType.ChatInput,
        options: [
        {
            name: "name",
            description: "Channel for send message",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {
    interaction.setCooldown(1000 * 60 * 60);

    const name = interaction.options.getString('name')
    client.user.setUsername(name).catch(() => { })
    interaction.reply({embeds: [new EmbedBuilder().setTitle('Nom').setDescription(`Le nom du bot modifié avec succès `)]})


    }     
}