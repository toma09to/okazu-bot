const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const log4js = require('log4js');
const sqlite3 = require('sqlite3');
const wait = require('node:timers/promises').setTimeout;
const getMessage = require('../../getMessage');

const logger = log4js.getLogger('okazu-bot');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('okazu')
    .setDescription("okazu-bot's commands.")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add an image.')
        .addAttachmentOption(option =>
          option.setName('image')
            .setDescription('An image you want to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('show')
        .setDescription("Provide today's jerk-off material.")
    ),
  async execute(interaction) {
    // Defer the reply to avoid Unknown interaction error.
    await interaction.deferReply();
    await wait(200);

    const db = new sqlite3.Database('./okazu.db');

    const errorMessage = getMessage('error')[interaction.locale]
      ?? 'There was an error while executing this command!';
    const wrongTypeMessage = getMessage('noImage')[interaction.locale]
      ?? 'Please send an image file!'
    const addingMessage = getMessage('addOkazu')[interaction.locale]
      ?? 'Added a jerk-off material successfully!';
    const showingMessage = getMessage('showOkazu')[interaction.locale]
      ?? "Provided today's jerk-off material!";
    const noImageMessage = getMessage('noOkazu')[interaction.locale]
      ?? 'No material was found! Please add materials with `/okazu add`!';
    
    const subCommand = interaction.options.getSubcommand();
    if (subCommand === 'add') {
      const attachment = interaction.options.getAttachment('image');

      if (
        !attachment.name.endsWith('.gif')
        && !attachment.name.endsWith('.jpg')
        && !attachment.name.endsWith('.jpeg')
        && !attachment.name.endsWith('.png')
        && !attachment.name.endsWith('.webp')
      ) {
        // A file attached is not an image file
        logger.info(`A file sent by ${interaction.user.username} is not an image file.`);
        await interaction.editReply(wrongTypeMessage);
      } else {
        const imageResponse = await fetch(attachment.attachment);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        db.run(
          'INSERT INTO images (name, data) VALUES (?, ?)',
          [attachment.name, imageBuffer],
          async err => {
            if (err) {
              logger.error(err);
              await interaction.editReply(errorMessage);
            } else {
              await interaction.editReply(addingMessage);
              logger.info(`An okazu was added successfully by ${interaction.user.username}.`);
            }
        });
      }
    } else if (subCommand === 'show') {
      db.get('SELECT name, data FROM images ORDER BY RANDOM() LIMIT 1', async (err, row) => {
        if (err) {
          logger.error(err);
          await interaction.editReply(errorMessage);
        } else {
          if (row) {
            const image = Buffer.from(row.data);

            await interaction.editReply({
              content: showingMessage,
              files: [new AttachmentBuilder().setName(row.name).setFile(image)],
            });

            logger.info(`${interaction.user.username} displayed an okazu.`);
          } else {
            // No image was found
            await interaction.editReply(noImageMessage);
          }
        }
      });
    } else {
      logger.error(`No subcommand matching ${subCommand} was found.`);
    }

    logger.debug('Executed /okazu');
    db.close();
  }
};