const { ApplicationCommandType, ApplicationCommandOptionType, Colors, ButtonBuilder,EmbedBuilder, ActionRowBuilder, ChannelType } = require('discord.js');
const logs = require('../../Models/logs')

module.exports = {
    name: 'setlogs',
    description: '🚑 Active les logs dans un salon',
    default_member_permissions: '8',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "channel",
            description: "logs",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

execute: async (client, interaction, args) => {

    let channel = interaction.options.getChannel("channel")

    if(channel.type === ChannelType.GuildVoice) return interaction.reply("Ceci n'est pas un salon textuel")
    if(channel.type === ChannelType.GuildCategory) return interaction.reply("Ceci n'est pas un salon textuel")

    if(!interaction.guild.channels.cache.get(channel.id)) return interaction.reply("Salon non trouvé")

    let a = await logs.findOne({ guildID: interaction.guild.id})
    
    let sv = new logs({
        guildID: interaction.guild.id,
        ChannelID: channel.id
    })

    a ? await logs.updateOne({ guildID: interaction.guild.id }, { ChannelID: channel.id }): await sv.save()

    const embed = new EmbedBuilder().setColor('Red').setTitle('Salon des logs').setDescription(`Vous avez défini le salon des logs sur : <#${channel.id}>`)

    interaction.reply({embeds: [embed]})
    }     
}
