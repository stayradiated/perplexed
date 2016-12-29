import qs from 'qs'
import PlexAPI from 'plex-api'
import {normalize} from 'normalizr'

import {parseSectionContainer} from './section'
import {albumContainerSchema, parseAlbumContainer} from './album'
import {trackContainerSchema, parseTrackContainer} from './track'
import {playQueueSchema, parsePlayQueue} from './playQueue'

export default class Client {
  constructor (config) {
    this.api = new PlexAPI(config.server)
  }

  root () {
    return this.api.query('/')
  }

  sections () {
    return this.api.query('/library/sections')
      .then((res) => parseSectionContainer(res))
  }

  section (id) {
    return this.api.query(`/library/sections/${id}`)
  }

  queryWithRange (options = {start: 0, size: 20}) {
    const extraHeaders = {}

    if (typeof options.start === 'number') {
      extraHeaders['X-Plex-Container-Start'] = options.start.toString()
    } else {
      extraHeaders['X-Plex-Container-Start'] = '0'
    }

    if (typeof options.size === 'number') {
      extraHeaders['X-Plex-Container-Size'] = options.size.toString()
    }

    return this.api.query({
      ...options,
      extraHeaders,
    })
  }

  albums (section, options = {}) {
    const params = qs.stringify({
      type: 9,
      sort: 'addedAt:desc',
    })
    const uri = `/library/sections/${section}/all?${params}`

    return this.queryWithRange({...options, uri})
      .then((res) => parseAlbumContainer(res))
      .then((res) => normalize(res, albumContainerSchema))
  }

  album (albumId) {
    const uri = `/library/metadata/${albumId}`
    return this.api.query({uri})
      .then((res) => parseAlbumContainer(res))
      .then((res) => normalize(res, albumContainerSchema))
  }

  albumTracks (albumId, options = {}) {
    const params = qs.stringify({
      includeRelated: options.includeRelated ? 1 : 0,
    })
    const uri = `/library/metadata/${albumId}/children?${params}`

    return this.api.query({uri})
      .then((res) => parseTrackContainer(res))
      .then((res) => normalize(res, trackContainerSchema))
  }

  filter () {
    return this.api.query('/library/sections/1/albums?year=2016')
  }

  search (query) {
    const params = qs.stringify({
      type: 10,
      query,
    })
    return this.api.query(`/library/sections/1/search?${params}`)
  }

  transcode (options) {
    return this.signUrl('/photo/:/transcode', options)
  }

  signUrl (path, options) {
    const params = qs.stringify({
      ...options,
      'X-Plex-Token': this.api.authToken,
    })
    return `//${this.api.serverUrl}${path}?${params}`
  }

  rate (trackId, rating) {
    const params = qs.stringify({
      key: trackId,
      identifier: 'com.plexapp.plugins.library',
      rating,
    })
    return this.api.perform(`/:/rate?${params}`)
  }

  createQueue (options = {}) {
    const params = qs.stringify({
      type: 'audio',
      uri: options.uri,
      key: options.key,
      shuffle: options.shuffle ? 1 : 0,
      repeat: options.repeat ? 1 : 0,
      includeChapters: options.includeChapters ? 1 : 0,
      includeRelated: options.includeRelated ? 1 : 0,
    })
    return this.api.postQuery(`/playQueues?${params}`)
      .then((res) => parsePlayQueue(res))
      .then((res) => normalize(res, playQueueSchema))
  }

  timeline (options) {
    const {currentTime, queueItem, playerState} = options
    const params = qs.stringify({
      hasMDE: 1,
      ratingKey: queueItem.track.ratingKey,
      key: queueItem.track.key,
      playQueueItemID: queueItem.id,
      state: playerState,
      time: currentTime,
      duration: queueItem.track.duration,
    })
    return this.api.query(`/:/timeline?${params}`)
  }

  modifyAlbumGenre (albumId, tags, removeTags) {
    const options = tags.reduce((obj, tag, i) => {
      obj[`genre[${i}].tag.tag`] = tag
      return obj
    }, {
      'genre[].tag.tag-': removeTags.map(encodeURIComponent).join(', '),
    })

    const params = qs.stringify({
      ...options,
      type: 9,
      id: albumId,
      'genre.locked': 1,
    })

    return this.api.putQuery(`/library/sections/1/all?${params}`)
  }
}
