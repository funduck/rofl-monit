const Docker = require('dockerode');
const JSONStream = require('JSONStream');

module.exports = class DockerEventsListener {
  constructor(socket = '/var/run/docker.sock'){
    console.log('Docker socket', socket)
    this.docker = new Docker(socket);
    this.stream = JSONStream.parse();
  }

  async start(){
    const eventStream = await this.docker.getEvents();
    eventStream.pipe(this.stream)
    console.log('Docker event listener started')
  }

  getReadStream() {
    return this.stream;
  }
}
