const Item = require('./Item')
const Media = require('./Media')

class Track extends Item {
  constructor (client, data) {
    super(client, data, Track.TYPE_ID)

    this.ratingKey            = data.ratingKey
    this.key                  = data.key
    this.parentRatingKey      = data.parentRatingKey
    this.grandparentRatingKey = data.grandparentRatingKey
    this.type                 = data.type
    this.title                = data.title
    this.grandparentKey       = data.grandparentKey
    this.parentKey            = data.parentKey
    this.grandparentTitle     = data.grandparentTitle
    this.parentTitle          = data.parentTitle
    this.originalTitle        = data.originalTitle
    this.summary              = data.summary
    this.index                = data.index
    this.parentIndex          = data.parentIndex
    this.ratingCount          = data.ratingCount
    this.viewCount            = data.viewCount
    this.lastViewedAt         = data.lastViewedAt
    this.thumb                = data.thumb
    this.parentThumb          = data.parentThumb
    this.grandparentThumb     = data.grandparentThumb
    this.duration             = data.duration
    this.addedAt              = data.addedAt
    this.updatedAt            = data.updatedAt

    this.media = data.Media.map((media) => {
      new Media(this.client, media)
    })
  }
}

Track.TYPE_ID = 'track'

module.exports = Track
