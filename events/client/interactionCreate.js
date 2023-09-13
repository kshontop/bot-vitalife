const { Attachment } = require("discord.js");
const Discord = require ("discord.js");
const { raw } = require("express");
const logs = require('../../Models/logs');
const ms = require("ms")

module.exports = {
	name: 'interactionCreate',
	once: false,
execute: async (interaction, client) => {
    await slashCommands();

    async function slashCommands() {
        if(interaction.isChatInputCommand()) {

            const cmd = client.slashCommands.get(interaction.commandName);
            if(!cmd) {
                //return interaction.channel.send({ content: `${interaction.member}, **une erreur s'est produite.**` })
            }
            const args = [];
            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
    
            //console.log(db.get(`guild_${interaction.guild.id}_settings`))
            const cooldownData = `${interaction.user.id}/${interaction.commandName}`;
            if (client.cooldown.has(cooldownData)) {
              const time = ms(client.cooldown.get(cooldownData) - Date.now());
              
              return interaction.reply({ 
                embeds: [new Discord.EmbedBuilder().setDescription(`Veuillez patienter ${time.replace('m', ' minutes')} avant de pouvoir réutiliser cette commande.`)],
                
              });
            }        
        interaction.setCooldown = (time) => {
          client.cooldown.set(cooldownData, Date.now() + time);
          setTimeout(() => client.cooldown.delete(cooldownData), time);
        };

            console.log(`[SLASH COMMANDS] `.bold.red + `/${cmd.name}`.bold.blue + ` has been executed`.bold.white)
            cmd.execute(client, interaction, args);
        } else if(interaction.isButton()) {

          if (interaction.customId === 'pds'){
            let  cl = await logs.findOne({ guildID: interaction.guild.id })
            if(!cl) return interaction.reply({ content: `Channel des services non défini`, ephemeral: true});

            if(client.usersService.has(interaction.user.id)) {
              interaction.reply({ content: `Vous avez déjà pris votre prise de service.`, ephemeral: true})
            } else {
              const now = new Date();
              const hours = now.getHours();
              const minutes = now.getMinutes();
  
              const formattedTime = `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`; 
              const embed = new Discord.EmbedBuilder()
              .setAuthor({ name: `Prise de service - ${interaction.user.globalName}`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128',})
              .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
              .setColor('Green')
              .addFields(
                { name: `Agent`, value: `${interaction.user}`},
                { name: `Heure`, value: `${formattedTime}`}
              ) 
              .setFooter({ text: `Prise de service - EMS`})
  
  
              let canal = client.channels.resolve(cl.ChannelID)
              if(canal){
                canal.send({embeds: [embed]}).then(() => {
                  client.usersService.set(interaction.user.id, interaction.user);
                  client.serviceStartTimes.set(interaction.user.id, new Date());
                })

                interaction.reply({content: `Vous avez pris votre service.`, ephemeral: true})
              }
            }
          }
          
          if (interaction.customId === 'fds'){
            let  cl = await logs.findOne({ guildID: interaction.guild.id })
            if(!cl) return interaction.reply({ content: `Channel des services non défini`, ephemeral: true});

            if(client.usersService.has(interaction.user.id)) {
              let canal = client.channels.resolve(cl.ChannelID)
              if(canal){
              const serviceStartTime = client.serviceStartTimes.get(interaction.user.id);
              const endTime = new Date();
              const serviceDuration = new Date(endTime - serviceStartTime);
              const formattedDuration = `${serviceDuration.getUTCHours()}h ${serviceDuration.getUTCMinutes()}m ${serviceDuration.getUTCSeconds()}s`;

              const now = new Date();
              const hours = now.getHours();
              const minutes = now.getMinutes();
  
              const formattedTime = `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`; 
              const embed = new Discord.EmbedBuilder()
              .setAuthor({ name: `Fin de service - ${interaction.user.globalName}`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128',})
              .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
              .setColor('Red')
              .addFields(
                { name: `Agent`, value: `${interaction.user}`},
                { name: `Heure`, value: `${formattedTime}`},
                { name: `Temps de service:`, value: `${formattedDuration}`},
              ) 
              .setFooter({ text: `Fin de service - EMS`})

                canal.send({embeds: [embed]})
                interaction.reply({content: `Vous avez pris votre fin de service.`, ephemeral: true})
              }
            } else {
              interaction.reply({ content: `Vous n'avez pas pris votre prise de service.`, ephemeral: true})
            }
          }
        } 

    }
}
}