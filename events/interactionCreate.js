const { Events, MessageFlags } = require('discord.js');
const log4js = require('log4js');
const wait = require('node:timers/promises').setTimeout;
const getMessage = require('../getMessage');
const { channelId } = require('../config.json');

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

    if (interaction.channelId !== channelId) {
      const wrongChannelMessage = getMessage('wrongChannel')[interaction.locale]
        ?? 'Please enter the command on the specified channel!';
      if (!interaction.replied && !interaction.deferred) {
        // Defer the reply to avoid Unknown interaction error.
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }
      // Wait to avoid Unknown interaction error.
      await wait(200);
      await interaction.editReply(wrongChannelMessage);

      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error);

      const errorMessage = getMessage('error')[interaction.locale]
        ?? 'There was an error while executing this command!';

      if (!interaction.replied && !interaction.deferred) {
        // Defer the reply to avoid Unknown interaction error.
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      }
      // Wait to avoid Unknown interaction error.
      await wait(200);
      await interaction.editReply(errorMessage);
    }
  },
};