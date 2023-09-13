const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'setavatar',
    description: '🚑 Permet de changer la photo de profil du bot.',
    default_member_permissions: '8',
    type: ApplicationCommandType.ChatInput,
        options: [
        {
            name: "image",
            description: "Channel for send message",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {
    interaction.setCooldown(1000 * 60 * 60);

    const image = interaction.options.getAttachment('image')
    client.user.setAvatar(image.url)
    interaction.reply({embeds: [new EmbedBuilder().setTitle('Avatar').setDescription(`L'avatar du bot modifié avec succès `)]})

    }     
}
 