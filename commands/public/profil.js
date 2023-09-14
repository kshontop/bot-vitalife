const { ApplicationCommandType, Colors, ButtonBuilder,EmbedBuilder, ActionRowBuilder } = require('discord.js');

const logs = require('../../models/users.js');

module.exports = {
    name: 'profil',
    description: '🚑 Permet d\'afficher vos temps de services',
    type: ApplicationCommandType.ChatInput,

    execute: async (client, interaction, args) => {
     const dataUser = await logs.findOne({ userID: interaction.user.id });
        if(!dataUser) return interaction.reply({embeds: [new EmbedBuilder().setDescription('Vous n\'avez pas encore effectué de service, ce qui signifie que nous ne pouvons pas afficher votre service total.')]})

        const totalServiceHours = Math.floor(dataUser.totalServiceTime / 3600000);
        const totalServiceMinutes = Math.floor((dataUser.totalServiceTime % 3600000) / 60000);
        const totalServiceSeconds = Math.floor((dataUser.totalServiceTime % 60000) / 1000);
        const totalFormat = `${totalServiceHours} heures ${totalServiceMinutes} minutes ${totalServiceSeconds} secondes`
            const match = new EmbedBuilder()
                .setColor(Colors.Green)
                .setDescription( `Votre temps de service total s'élève à **${totalFormat}**`)


                interaction.reply({embeds: [match], components: [],})
    }     
}