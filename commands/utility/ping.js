const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('For connectivity test.'),
  async execute(logger, interaction) {
    await interaction.reply('Pong!');
    logger.debug('Executed /ping');
  },
};