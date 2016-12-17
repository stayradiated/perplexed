class Part {
  constructor (client, data) {
    this.client = client

    this.id = data.id
    this.key = data.key
    this.duration = data.duration
    this.file = data.file
    this.size = data.size
    this.container = data.container
    this.hasThumbnail = data.hasThumbnail
  }
}

module.exports = Part
