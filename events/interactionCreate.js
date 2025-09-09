const { Events, MessageFlags } = require('discord.js');
const log4js = require('log4js');
const getMessage = require('../getMessage');

const logger = log4js.getLogger('okazu-bot');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error);

      const errorMessage = getMessage('error')[interaction.locale]
        ?? 'There was an error while executing this command!';

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          flags: MessageFlags.Ephemeral
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          flags: MessageFlags.Ephemeral
        });
      }
    }
  },
};