const TelegramBot = require('node-telegram-bot-api');
const { Writable } = require('node:stream');

module.exports = class TelegramStream extends Writable {
  constructor() {
    super({
      decodeStrings: false
    })
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;

    this.telegram = new TelegramBot(
      this.token,
      {polling: false}
    );
  }

  _write(chunk, encoding, next) {
    telegram.sendMessage(this.chatId, this.chunk).then(() => next()).catch(console.error);
    next();
  }
}
