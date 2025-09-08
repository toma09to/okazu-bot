const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const getMessage = require('../../getMessage');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('For connectivity test.'),
  async execute(logger, interaction) {
    const response = getMessage(logger, 'pong', interaction.locale);

    await interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
    logger.debug('Executed /ping');
  },
};