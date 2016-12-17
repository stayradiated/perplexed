const Album = require('./Album')
const Track = require('./Track')

class MediaContainer {
  constructor (client, data) {
    this.client = client

    if (data.MediaContainer != null) {
      data = data.MediaContainer
    }

    this.size            = data.size
    this.totalSize       = data.totalSize
    this.allowSync       = data.allowSync
    this.art             = data.art
    this.identifier      = data.identifier
    this.mediaTagPrefix  = data.mediaTagPrefix
    this.mediaTagVersion = data.mediaTagVersion
    this.mixedParents    = data.mixedParents
    this.nocache         = data.nocache
    this.offset          = data.offset
    this.thumb           = data.thumb
    this.title1          = data.title1
    this.title2          = data.title2
    this.viewGroup       = data.viewGroup
    this.viewMode        = data.viewMode

    // this.Metadata = data.Metadata
    this.metadata = data.Metadata.map((item) => {
      switch (item.type) {
        case Album.TYPE_ID:
          return new Album(this.client, item)
        case Track.TYPE_ID:
          return new Track(this.client, item)
        default:
          console.log(JSON.stringify(item, null, 2))
          return item
      }
    })
  }
}

module.exports = MediaContainer
