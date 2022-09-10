const templates = require('./templates');

module.exports = class Monitor {
  constructor () {}

  connect(eventsStream, notificationsStream) {
    eventsStream.on('data', (event) => {
      // console.log('DEBUG', event);
      const template = templates[`${event.Type}_${event.Action}`];
      if (template) {
        notificationsStream.write(template(event))
      }
    })
    eventsStream.on('error', (err) => {
      console.error(err)
    })
  }
}
