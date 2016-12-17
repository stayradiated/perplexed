const Item = require('./Item')

class Album extends Item {
  constructor (client, data) {
    super(client, data, Album.TYPE_ID)

    this.allowSync = data.allowSync
    this.librarySectionID = data.librarySectionID
    this.librarySectionTitle = data.librarySectionTitle
    this.librarySectionUUID = data.librarySectionUUID
    this.ratingKey = data.ratingKey
    this.key = data.key
    this.parentRatingKey = data.parentRatingKey
    this.studio = data.studio
    this.type = data.type
    this.title = data.title
    this.parentKey = data.parentKey
    this.parentTitle = data.parentTitle
    this.summary = data.summary
    this.index = data.index
    this.viewCount = data.viewCount
    this.lastViewedAt = data.lastViewedAt
    this.year = data.year
    this.thumb = data.thumb
    this.parentThumb = data.parentThumb
    this.originallyAvailableAt = data.originallyAvailableAt
    this.leafCount = data.leafCount
    this.addedAt = data.addedAt
    this.updatedAt = data.updatedAt
    this.Genre = data.Genre
  }

  fetchTracks () {
    return this.client.fetchMedia(this.key)
  }
}

Album.TYPE_ID = 'album'

module.exports = Album
