const yaml = require('js-yaml');
const fs = require('node:fs');
const log4js = require('log4js');

const logger = log4js.getLogger('okazu-bot');

const messages = {
  'en-US': yaml.load(fs.readFileSync('messages/en-US.yml'), 'utf-8'),
  'ja': yaml.load(fs.readFileSync('messages/ja.yml'), 'utf-8'),
};

module.exports = function(messageId) {
  for (const loc of Object.keys(messages)) {
    if (!messages[loc][messageId]) {
      logger.warn(`Message '${messageId}' was not found in ${loc}.yml.`);
    }
  }

  return Object.fromEntries(
    Object.entries(messages).map(([key, val]) => [key, val[messageId]])
  );
}