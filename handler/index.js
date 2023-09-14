const { readdirSync } = require('fs');
const colors = require('colors');

module.exports = (client) => {
   
    const arrayOfSlashCommands = [];

    const loadSlashCommands = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs => {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
            for (const files of commands) {
                const getFileName = require(`../${dir}/${dirs}/${files}`);
                client.slashCommands.set(getFileName.name, getFileName);
                console.log(`[SLASH COMMANDS]`.bold.green + ` Chargement de la commande :`.bold.white + ` ${getFileName.name}`.bold.green);
                arrayOfSlashCommands.push(getFileName);
            }
        })

        setTimeout(async () => {
            console.log(`[API]`.bold.white + ` Synchronisation de toutes les commandes avec l'API Discord.`.bold.green)
            await client.application.commands.set(arrayOfSlashCommands);
        }, 5000)
    }
    loadSlashCommands();

    console.log(`•----------•`.bold.black)

    // # events
    const loadEvents = (dir = "./events/") => {
        readdirSync(dir).forEach(dirs => {
            const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));
      
            for(const files of events) {
                const getFileName = require(`../${dir}/${dirs}/${files}`)
                client.on(getFileName.name, (...args) => getFileName.execute(...args, client))
                console.log(`[EVENTS]`.bold.green + ` Chargement de l'événement :`.bold.white + ` ${getFileName.name}`.bold.green);
                if(!events) return console.log(`[EVENTS]`.bold.green + `Nothing event in : `.bold.yellow + `${files}`.bold.green)
            }
        })
    }
    loadEvents();
    console.log(`•----------•`.bold.black)
}