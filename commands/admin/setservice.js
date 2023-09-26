const { ApplicationCommandType, ApplicationCommandOptionType, Colors, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ServiceData = require('../../models/service');

module.exports = {
    name: 'setservice',
    description: '⛽ Affiche l\'embed principal du BOT',
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

    if(channel.type === ChannelType.GuildText) {
        if(!interaction.guild.channels.cache.get(channel.id)) return interaction.reply("Salon non trouvé")

        let a = await ServiceData.findOne({ guildID: interaction.guild.id })
  
        let sv = new ServiceData({
            guildID: interaction.guild.id,
            channelID: channel.id
        })

        a ? await ServiceData.updateOne({ guildID: interaction.guild.id }, { channelID: channel.id }): await sv.save()

        const embeds = new EmbedBuilder().setColor('Red').setTitle('Salon des logs').setDescription(`Vous avez défini le salon des logs sur : <#${channel.id}>`)
      
        interaction.reply({embeds: [embeds]})
        
        const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`Merci de sélectionner l'une des options en cliquant sur un des boutons pour indiquer le début ou la fin de votre service.`)
    
    const pds = new ActionRowBuilder().addComponents(
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
        await channel.send({embeds: [embed], components: [pds]})
    }

    }     
}
 