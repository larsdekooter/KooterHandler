const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {Discord.Client} client 
 */
function ExecuteFunction(interaction, client) {};

class Command {
    /**
     * @typedef {{ data: SlashCommandBuilder, test: boolean, name: string execute: ExecuteFunction}} CommandOptions
     * @param {CommandOptions} options
     */
    constructor(options) {
        this.name = options.name,
        this.data = options.data,
        this.test = options.test;
        this.execute = options.execute;

    }
}

module.exports = Command;