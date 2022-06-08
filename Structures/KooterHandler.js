const CustomError = require('./CustomError')
const path = require('path');
const {Client, Collection} = require('discord.js');
const { readdirSync } = require("fs");
const { dirname } = require("path");

class KooterHandler {
    /**
     * @typedef {Object} KooterHandlerOptions
     * @property {string} [CommandsFolder] The folder name the commands are located
     * @property {string} [EventsFolder] The folder name the events are located
     * @property {string[]} guildIds Array of test guild ids
     * @property {string[]} ownerIds Array of bot owner IDs 
     * @property {Boolean} loadCommands
     */
    /**
     * @param {Client} client
     * @param {KooterHandlerOptions} options 
     */
    constructor(client, options) {
        if(!options || !options.guildIds || !options.ownerIds || !client || !client instanceof Client) throw new CustomError({ message: 'Failed to load assets. Missing information', code: 'MISSING_INFORMATION' });
        // Command Handler
        if(options.CommandsFolder) {
            const commandFolder = path.join(__dirname.split('node_modules\\')[0], options.CommandsFolder);
            const commandFiles = readdirSync(commandFolder).filter(file => file.endsWith('.js'));

            client.commands = new Collection();
            commandFiles.forEach(file => {
                const command = require(`${commandFolder}/${file}`);
                client.commands.set(command.data.name, command)
            });

            client.on('interactionCreate', async (interaction) => {
                if(!interaction.isCommand()) return;
                const command = client.commands.get(interaction.commandName)
                if(!command) throw new CustomError({ message: 'Didnt find the command that ran!', code: 'COMMAND_NOT_FOUND' });
                try {
                    await command.execute(interaction, client);
                } catch (error) {
                    console.error(error)
                    if(interaction.replied || interaction.deferred) return await interaction.editReply('Oops: something went wrong on our side!');
                    await interaction.reply('Oops: something went wrong on our side!');
                }
            })
        }
        // Event Handler
        if(options.EventsFolder) {
            const eventsFolder = path.join(__dirname.split('node_modules\\')[0], options.EventsFolder);
            readdirSync(eventsFolder)
                .filter(file => file.endsWith('.js'))
                .forEach(file => {
                    const event = require(`${eventsFolder}/${file}`);
                    client.on(event.event, event.run.bind(null, client))
                })
        }
        // Loading Commands
        // console.log(options.loadCommands)
        if(options.loadCommands == true) {
            console.log('hey')
            const commandFolder = path.join(__dirname.split('node_modules\\')[0], options.CommandsFolder);
            const commandFiles = readdirSync(commandFolder).filter(file => file.endsWith('.js'));

            const privateCommands = [];
            const commands = [];

            commandFiles.forEach(file => {
                const command = require(`${commandFolder}/${file}`);
                if(command.test === true) privateCommands.push(command.data.toJSON())
                else commands.push(command.data.toJSON())
            });
            (async () => { 
                function load() {
                    return new Promise(async (resolve, reject) => {
                        try {
                            options.guildIds.forEach(async id => {
                                await client.guilds.cache.get(id).commands.set(privateCommands);
                                //  await wait()
                                console.log('loaded')
                                resolve()
                            })
                        } catch (error) {
                            reject(error)
                        }
                    })
                }
                 await load()
                console.log('Loaded all commands')
            })()
        }
    }
};




function wait() {
    return new Promise(resolve => {
        setTimeout(resolve, 3000);
    })
}

module.exports = KooterHandler