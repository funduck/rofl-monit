const TelegramStream = require('./exporters/telegram');

const cache = new Map()

module.exports.getExportStream = function(name) {
  name = name || 'console'
  if (!cache.has(name)) {
    let exportStream;
    switch (name) {
      case 'telegram': {
        exportStream = new TelegramStream();
        break
      }
      case 'console': {
        exportStream = process.stdout;
        break
      }
    }
    cache.set(name, exportStream);
  }
  console.log(`getExporterStream: ${name}`);
  return cache.get(name);
}
