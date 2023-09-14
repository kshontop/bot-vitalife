/*const { ApplicationCommandType, PermissionFlagsBits,ApplicationCommandOptionType, Colors, EmbedBuilder } = require('discord.js');
const discord = require('discord.js')
module.exports = {
    name: 'setabs',
    description: '🚑 Permet de créer un rapport',
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
    
    
    const embed = new discord.EmbedBuilder()
    .setColor('Green')
    .setTitle(`🚑 __Signaler une absence__`)
    .setDescription('Merci de fournir votre nom, prénom, matricule, raison, durée, ainsi que les coordonnées de la personne à prévenir.')


const row = new discord.ActionRowBuilder().addComponents(
    new discord.ButtonBuilder()
    .setCustomId('envoyer')
    .setLabel('📝 Envoyé')
    .setStyle('Primary'),
    new discord.ButtonBuilder()
    .setCustomId('helpme')
    .setLabel('❓ Besoin d\'aide')
    .setStyle('Primary'),
)
  const channels = client.channels.cache.get(channel.id);
    await channels.bulkDelete(20, true);
    await channel.send({embeds: [embed], components: [row]})
    }     
}
 */