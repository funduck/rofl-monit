module.exports.Exporter = class Exporter {
  getWriteStream() {
    throw new Error('Should implement your method')
  }
}

const cache = new Map()
module.exports.getExporter = function(name) {
  if (!cache.has(name)) {
    let ExporterCls;
    switch (name) {
      case 'telegram': {
        ExporterCls = require('./exporters/telegram')
        break
      }
      default: {
        ExporterCls = require('./exporters/console')
        break
      }
    }
    cache.set(name, new ExporterCls())
  }
  return cache.get(name)
}
