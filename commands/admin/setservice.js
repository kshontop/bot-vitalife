const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'setservice',
    description: '🚑 Affiche l\'embed principal du BOT',
    default_member_permissions: '8',
    type: ApplicationCommandType.ChatInput,
        options: [
        {
            name: "channel",
            description: "Channel for send message",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],
execute: async (client, interaction, args) => {

    const channel = interaction.options.getChannel('channel')
    const embed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Merci de sélectionner l'une des options en cliquant sur un des boutons pour indiquer le début ou la fin de votre service.`)

const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('pds')
    .setEmoji('✅')
    .setLabel('Prise de service')
    .setStyle('Success'),
     new ButtonBuilder()
    .setCustomId("fds")
    .setEmoji('⛔')
    .setLabel("Fin de service")
    .setStyle("Danger"),
  );
  const channels = client.channels.cache.get(channel.id);
    await channels.bulkDelete(20, true);
    await channel.send({embeds: [embed], components: [row]})
    }     
}
 