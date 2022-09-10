const EventsListener = require('./events_listener');
const { getExportStream: getExporterStream } = require('./export_stream');
const Monitor = require('./monitor');

const listener = new EventsListener(process.env.DOCKER_SOCKET)
const monitor = new Monitor()
const exportStream = getExporterStream(process.env.EXPORTER);

monitor.connect(listener.getReadStream(), exportStream)

listener.start().catch(console.error)
