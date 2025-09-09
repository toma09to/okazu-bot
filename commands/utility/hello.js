const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const log4js = require('log4js');
const wait = require('node:timers/promises').setTimeout;
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

    // Defer the reply to avoid Unknown interaction error.
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await wait(200);
    await interaction.editReply(response ?? 'Hello!');
    logger.debug('Executed /hello');
  },
};