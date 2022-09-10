const {Exporter} = require("../exporter")

module.exports = class ConsoleExporter extends Exporter {
  getWriteStream() {
    return process.stdout
  }
}
