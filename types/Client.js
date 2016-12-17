const PlexAPI = require('plex-api')

const MediaContainer = require('./MediaContainer')

class Client {
  constructor (config) {
    this.api = new PlexAPI(config)
  }

  root () {
    return this.api.query('/')
  }

  sections () {
    return this.api.query('/library/sections')
  }

  section () {
    return this.api.query('/library/sections/1')
  }

  fetchMedia (uri) {
    return this.api.query({
      uri,
      extraHeaders: {
        'X-Plex-Container-Size': '30',
        'X-Plex-Container-Start': '0',
      },
    })
    .then((res) => new MediaContainer(this, res))
  }

  albums () {
    return this.fetchMedia(
      '/library/sections/1/all?type=9&sort=addedAt:desc')
  }

  filter () {
    return this.api.query('/library/sections/1/albums?year=2016')
  }

  search (query) {
    return this.api.query(`/library/sections/1/search?type=10&query=${query}`)
  }
}

module.exports = Client
