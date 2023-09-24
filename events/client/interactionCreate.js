const Discord = require("discord.js");
const logsData = require('../../models/logs.js');
const users = require('../../models/users.js');
const ms = require("ms");
const { red } = require("colors");

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
     
    const rowta = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
        .setCustomId('fds')
        .setLabel('test')
        .setStyle('Danger')
        .setEmoji("⛔")
    )
        await slashCommands();

        async function slashCommands() {
            if (interaction.isChatInputCommand()) {

                const cmd = client.slashCommands.get(interaction.commandName);
                if (!cmd) {
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
            } else if (interaction.isButton()) {

                if (interaction.customId === 'pds') {
                    let cl = await logsData.findOne({ guildID: interaction.guild.id })
                    if (!cl) return interaction.reply({ content: `Channel des services non défini`, ephemeral: true });

                    const userData = await users.findOne({ guildID: interaction.guild.id, userID: interaction.user.id });

                    if (userData) {
                        if (userData.isInService) {
                            interaction.reply({ content: `Vous avez déjà pris votre prise de service.`, ephemeral: true })
                        } else {
                            let canal = client.channels.resolve(cl.channelID);

                            if (canal) {
                                userData.isInService = true;
                                userData.serviceStartTime = new Date();
                                await userData.save();

                                const now = new Date();
                                const options = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' };
                                const formattedTime = now.toLocaleTimeString('fr-FR', options);

                                const day = now.getDate().toString().padStart(2, '0');
                                const month = (now.getMonth() + 1).toString().padStart(2, '0');
                                const year = now.getFullYear();

                                const embed = new Discord.EmbedBuilder()
                                    .setAuthor({ name: `Prise de service - ${interaction.user.globalName}`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128', })
                                    .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
                                    .setColor('Green')
                                    .addFields(
                                        { name: `Agent`, value: `${interaction.user}` },
                                        { name: `Heure`, value: `${formattedTime}` },
                                        { name: `Date`, value: `${day}/${month}/${year}` }

                                    )
                                    .setFooter({ text: `Prise de service - WhiteCustom` })

                                canal.send({ embeds: [embed] })

                                const msg = await interaction.reply({ content: `${interaction.user}, vous avez pris votre service.` })

                               /*setTimeout(async () => {
                                await interaction.user.send({ components: [rowta], embeds: [new Discord.EmbedBuilder().setColor('Red').setTitle('**__Êtes-vous toujours en prise service ?__**').setDescription("Merci de choisir l'une des options suivantes pour indiquer si vous êtes toujours en service ou si vous avez terminé ")]}).catch(() => { return interaction.channel.send(`❌ Impossible d'envoyer un message privé à ${interaction.user.tag}`)})
                                }, 10000);*/
                                setTimeout(() => {
                                    msg.delete().catch(() => { })
                                }, 2000);
                            } else {
                                return interaction.reply({ content: `Channel des services non trouvé`, ephemeral: true });
                            }
                        }
                    } else {
                        const newUser = new users({
                            guildID: interaction.guild.id,
                            userID: interaction.user.id,
                            serviceStartTime: new Date(),
                            totalServiceTime: 0,
                            isInService: true
                        })

                        await newUser.save();
                        let canal = client.channels.resolve(cl.channelID);
                        if (canal) {
                            const now = new Date();
                            const options = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' };
                            const formattedTime = now.toLocaleTimeString('fr-FR', options);

                            const day = now.getDate().toString().padStart(2, '0');
                            const month = (now.getMonth() + 1).toString().padStart(2, '0');
                            const year = now.getFullYear();

                            const embed = new Discord.EmbedBuilder()
                                .setAuthor({ name: `Prise de service - ${interaction.user.globalName}`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128', })
                                .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
                                .setColor('Green')
                                .addFields(
                                    { name: `Agent`, value: `${interaction.user}` },
                                    { name: `Heure`, value: `${formattedTime}` },
                                    { name: `Date`, value: `${day}/${month}/${year}` }

                                )
                                .setFooter({ text: `Prise de service - WhiteCustom` })

                            canal.send({ embeds: [embed] })
                            const msg = await interaction.reply({ content: `${interaction.user}, vous avez pris votre service.` });
                        }
                    }
                }

                if (interaction.customId === 'fds') {
                    let cl = await logsData.findOne({ guildID: interaction.guild.id })
                    if (!cl) return interaction.reply({ content: `Channel des services non défini`, ephemeral: true });
                    
                    const userData = await users.findOne({ guildID: interaction.guild.id, userID: interaction.user.id });
                    
                    if (userData) {
                        if (userData.isInService) {
                            let canal = client.channels.resolve(cl.channelID);

                            if (canal) {
                                const currentTime = new Date();
                                const serviceTime = currentTime - userData.serviceStartTime;
                                
                                userData.totalServiceTime += serviceTime;
                                userData.isInService = false;

                                await userData.save();

                                const serviceHours = Math.floor(serviceTime / 3600000);
                                const serviceMinutes = Math.floor((serviceTime % 3600000) / 60000);
                                const serviceSeconds = Math.floor((serviceTime % 60000) / 1000);
                                const now = new Date();
                                const options = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' };
                                const formattedTime = now.toLocaleTimeString('fr-FR', options);

                                const totalServiceHours = Math.floor(userData.totalServiceTime / 3600000);
                                const totalServiceMinutes = Math.floor((userData.totalServiceTime % 3600000) / 60000);
                                const totalServiceSeconds = Math.floor((userData.totalServiceTime % 60000) / 1000);

                                const totalFormat = `${totalServiceHours}h${totalServiceMinutes}m${totalServiceSeconds}s`

                                const formattedTime2 = `${serviceHours}h ${serviceMinutes}m ${serviceSeconds}s`

                                const embed = new Discord.EmbedBuilder()
                                    .setAuthor({ name: `Fin de service - ${interaction.user.globalName}`, iconURL: 'https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128', })
                                    .setThumbnail('https://cdn.discordapp.com/icons/1068556793896247356/c258200f480d432709f8fc68ad1e1ce6.webp?size=128')
                                    .setColor('Red')
                                    .addFields(
                                        { name: `Agent`, value: `${interaction.user}` },
                                        { name: `Heure`, value: `${formattedTime}` },
                                        { name: `Temps de service:`, value: `${formattedTime2}` },
                                        { name: `Temps total en service:`, value: `${totalFormat}` },
                                    )
                                    .setFooter({ text: `Fin de service - WhiteCustom ` })

                                canal.send({ embeds: [embed] })

                                const msg = await interaction.reply({ content: `${interaction.user}, vous avez pris votre fin de service.` })
                                setTimeout(() => {
                                    msg.delete().catch(() => { })
                                }, 2000);

                            } else {
                                return interaction.reply({ content: `Channel des services non trouvé`, ephemeral: true });
                            }
                        } else {
                            interaction.reply({ content: `Vous n'avez pas pris votre prise de service.`, ephemeral: true })
                        }
                    } else {
                        interaction.reply({ content: 'Vous n\'avez pas enregistré de prise de service.', ephemeral: true });
                    }
                }
            }
        }
    }
}
