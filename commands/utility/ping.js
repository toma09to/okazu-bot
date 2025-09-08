const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const log4js = require('log4js');
const getMessage = require('../../getMessage');

const logger = log4js.getLogger('okazu-bot');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('For connectivity test.'),
  async execute(interaction) {
    const response = getMessage('pong')[interaction.locale];

    await interaction.reply({ content: response ?? 'Pong!', flags: MessageFlags.Ephemeral });
    logger.debug('Executed /ping');
  },
};