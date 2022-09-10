const EventsListener = require('./events_listener');
const { getExporter } = require('./exporter');
const Monitor = require('./monitor');

const listener = new EventsListener(process.env.DOCKER_SOCKET)
const monitor = new Monitor()
const exporter = getExporter(process.env.EXPORTER);

monitor.connect(listener.getReadStream(), exporter.getWriteStream())

listener.start().catch(console.error)
