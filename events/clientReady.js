const { Events, REST, Routes } = require('discord.js');
const log4js = require('log4js');
const { token, clientId, guildId } = require('../config.json');
const grabCommands = require('../grabCommands');

const logger = log4js.getLogger('okazu-bot');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);

    // Deploys all application commands when a bot is ready
    const commands = grabCommands(logger).map(command => command.data.toJSON());

    const rest = new REST().setToken(token);

    (async () => {
      try {
        logger.info(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: commands },
        );

        logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        logger.error(error);
      }
    })();
  },
};