const Part = require('./Part')

class Media {
  constructor (client, data) {
    this.client = client

    this.id = data.id
    this.duration = data.duration
    this.bitrate = data.bitrate
    this.audioChannels = data.audioChannels
    this.audioCodec = data.audioCodec
    this.container = data.container

    this.part = data.Part.map((part) => {
      return new Part(this.client, part)
    })
  }
}

module.exports = Media
