const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const log4js = require('log4js');
const getMessage = require('../../getMessage');

const logger = log4js.getLogger('okazu-bot');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('For connectivity test.')
    .setDescriptionLocalizations(getMessage('helloDescription')),
  async execute(interaction) {
    const response = getMessage('hello')[interaction.locale];

    await interaction.reply({ content: response ?? 'Hello!', flags: MessageFlags.Ephemeral });
    logger.debug('Executed /hello');
  },
};