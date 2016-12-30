import qs from 'qs'
import PlexAPI from 'plex-api'
import {normalize} from 'normalizr'
import assert from 'assert'

import {parseSectionContainer} from './types/section'
import {albumContainerSchema, parseAlbumContainer} from './types/album'
import {artistContainerSchema, parseArtistContainer} from './types/artist'
import {trackContainerSchema, parseTrackContainer} from './types/track'
import {playQueueSchema, parsePlayQueue} from './types/playQueue'

// plex media types-- https://github.com/Arcanemagus/plex-api/wiki/MediaTypes
export const ARTIST = 8
export const ALBUM = 9
export const TRACK = 10

// custom types
export const QUEUE = 501

/**
 * Parse a plex response based on the data type
 *
 * @param {number} type - data type
 * @param {Object} data - response from plex api
 * @returns {Object}
 */

export function parseType (type, data) {
  switch (type) {
    case ARTIST:
      return parseArtistContainer(data)
    case ALBUM:
      return parseAlbumContainer(data)
    case TRACK:
      return parseTrackContainer(data)
    case QUEUE:
      return parsePlayQueue(data)
    default:
      throw new Error(`Unsupported type: "${type}". Cannot parse.`)
  }
}

/**
 * Normalize a __parsed__ plex response based on the data type
 * @param {number} type - data type
 * @param {Object} data - parsed plex response
 * @returns {Object}
 */

export function normalizeType (type, data) {
  switch (type) {
    case ARTIST:
      return normalize(data, artistContainerSchema)
    case ALBUM:
      return normalize(data, albumContainerSchema)
    case TRACK:
      return normalize(data, trackContainerSchema)
    case QUEUE:
      return normalize(data, playQueueSchema)
    default:
      throw new Error(`Unsupported type: "${type}". Cannot normalize.`)
  }
}


/**
 * Interact with a plex server
 *
 * @class Client
 * @param {Object|string} config - config to pass to `plex-api` package
 */

export default class Client {

  constructor (config) {
    this.api = new PlexAPI(config.server)
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Query the API for a limited set of results. By default Plex will return
   * everything that matches, which in most cases can be far too much data.
   *
   * @param {Object} options - query options
   * @param {number} options.start - first index to return
   * @param {number} options.size - how many items to return to
   * @returns {Promise} - the query result
   */

  queryWithRange (options = {start: 0, size: 20}) {
    const extraHeaders = {}

    extraHeaders['X-Plex-Container-Start'] = (
      typeof options.start === 'number'
        ? options.start.toString()
        : '0'
    )

    if (typeof options.size === 'number') {
      extraHeaders['X-Plex-Container-Size'] = options.size.toString()
    }

    return this.api.query({
      ...options,
      extraHeaders,
    })
  }

  /**
   * Add the 'X-Plex-Token' parameter to a given URI. This is used when loading
   * files directly from the browser.
   *
   * @param {string} path - the path to sign
   * @param {Object} options - query options
   * @returns {string} - the signed url
   */

  signUrl (path, options) {
    const params = qs.stringify({
      ...options,
      'X-Plex-Token': this.api.authToken,
    })
    return `//${this.api.serverUrl}${path}?${params}`
  }


  // ==========================================================================
  // ROOT
  // ==========================================================================

  /**
   * Query the root of the server
   *
   * @returns {Promise}
   */

  root () {
    return this.api.query('/')
  }


  // ==========================================================================
  // LIBRARY
  // ==========================================================================

  /**
   * Get all available sections in the library
   * @returns {Promise}
   */

  sections () {
    return this.api.query('/library/sections')
      .then((res) => parseSectionContainer(res))
  }

  /**
   * Get a specific section in the library
   *
   * @param {number} sectionId - the id of the section to get
   * @returns {Promise}
   */

  section (sectionId) {
    return this.api.query(`/library/sections/${sectionId}`)
  }

  allOfType (sectionId, type, options = {}) {
    assert(sectionId != null, 'Must specify section id')
    assert(typeof type === 'number', 'Must specify type')

    const params = qs.stringify({
      type,
      sort: 'addedAt:desc',
    })
    const uri = `/library/sections/${sectionId}/all?${params}`
    return this.queryWithRange({...options, uri})
      .then((res) => parseType(type, res))
  }


  /**
   * Fetch a metadata item
   *
   * @param {number} id
   * @param {number} type
   * @param {Object} [options] - params to add to the request
   * @returns {Promise}
   */

  metadata (id, type, options = {}) {
    assert(id != null, 'Must specify item id')
    assert(typeof type === 'number', 'Must specify type')

    const params = qs.stringify(options)
    const uri = `/library/metadata/${id}?${params}`
    return this.api.query({uri})
      .then((res) => parseType(type, res))
  }


  /**
   * Fetch children of a metadata item
   *
   * @param {number} id
   * @param {number} type
   * @param {Object} [options] - params to add to the request
   * @returns {Promise}
   */

  metadataChildren (id, type, options = {}) {
    assert(id != null, 'Must specify item id')
    assert(typeof type === 'number', 'Must specify type')

    const params = qs.stringify(options)
    const uri = `/library/metadata/${id}/children?${params}`
    return this.api.query({uri})
      .then((res) => parseType(type, res))
  }

  // ==========================================================================
  // ALBUMS
  // ==========================================================================

  /**
   * Query all albums in the library
   *
   * @param {number} sectionId - id of the section to fetch
   * @param {Object} [options] - query options
   * @returns {Promise}
   */

  albums (sectionId, options) {
    return this.allOfType(sectionId, ALBUM, options)
  }


  /**
   * Get information about a single album
   *
   * @param {number} albumId
   * @returns {Promise}
   */

  album (albumId) {
    return this.metadata(albumId, ALBUM)
  }


  /**
   * Get the tracks related to an album
   *
   * @param {number} albumId
   * @param {Object} [options]
   * @param {boolean} [options.includeRelated=false]
   * @returns {Promise}
   */

  albumTracks (albumId, options) {
    return this.metadataChildren(albumId, TRACK, options)
  }


  // ==========================================================================
  // ARTISTS
  // ==========================================================================

  /**
   * Query all artists in the library
   *
   * @param {number} sectionId - id of the library section
   * @param {Object} [options={}]
   */

  artists (sectionId, options = {}) {
    return this.allOfType(sectionId, ARTIST, options)
  }


  /**
   * Get information about a single artist
   *
   * @param {number} artistId
   * @returns {Promise}
   */

  artist (artistId) {
    return this.metadata(artistId, ARTIST)
  }


  /**
   * Get the albums related to an artist
   *
   * @param {number} artistId
   * @param {Object} [options]
   * @param {boolean} [options.includeRelated=false]
   * @returns {Promise}
   */

  artistAlbums (artistId, options) {
    return this.metadataChildren(artistId, ALBUM, options)
  }


  // ==========================================================================
  // SEARCH
  // ==========================================================================

  /**
   * Search the library for tracks matching a query
   *
   * @param {string} query
   */

  searchTracks (query) {
    const params = qs.stringify({
      type: 10,
      query,
    })
    return this.api.query(`/library/sections/1/search?${params}`)
  }


  // ==========================================================================
  // PHOTOS
  // ==========================================================================

  /**
   * Resize a photo to a specific size
   *
   * @params {Object} options
   * @params {string} options.uri
   * @params {number} options.width
   * @params {number} options.height
   * @returns {string}
   */

  resizePhoto (options) {
    return this.signUrl('/photo/:/transcode', options)
  }


  // ==========================================================================
  // RATINGS
  // ==========================================================================

  /**
   * Set the user rating for a track
   *
   * @params {number} trackId
   * @params {number} rating
   */

  rate (trackId, rating) {
    const params = qs.stringify({
      key: trackId,
      identifier: 'com.plexapp.plugins.library',
      rating,
    })
    return this.api.perform(`/:/rate?${params}`)
  }


  // ==========================================================================
  // QUEUE
  // ==========================================================================

  /**
   * Create a play queue from a uri
   *
   * @param {Object} options
   * @param {string} options.uri
   * @param {number} options.key
   * @param {boolean} options.shuffle
   * @param {boolean} options.repeat
   * @param {boolean} options.includeChapters
   * @param {boolean} options.includeRelated
   * @returns {Promise}
   */

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
      .then((res) => parseType(QUEUE, res))
  }


  // ==========================================================================
  // TIMELINE
  // ==========================================================================

  /**
   * Update plex about the current timeline status.
   *
   * @param {Object} options
   * @param {number} options.queueItemId - id of playlist queue item
   * @param {string} options.ratingKey - uri of track metadata
   * @param {number} options.key - id of track
   * @param {string} options.playerState - playing, paused, stopped
   * @param {number} options.currentTime - current time in ms
   * @param {number} options.duration - track duration in ms
   * @returns {Promise}
   */

  timeline (options) {
    const {currentTime, duration, queueItemId, ratingKey, key, playerState} = options
    const params = qs.stringify({
      hasMDE: 1,
      ratingKey,
      key,
      playQueueItemID: queueItemId,
      state: playerState,
      time: currentTime,
      duration,
    })
    return this.api.query(`/:/timeline?${params}`)
  }


  // ==========================================================================
  // MODIFY GENRE
  // ==========================================================================

  /**
   * Modify the genre tags for an item
   *
   * @param {number} sectionId - library section id
   * @param {number} type - type of item to modify
   * @param {number} id - id of the item to modify
   * @param {Array} addTags - tags to add to the item
   * @param {Array} [removeTags = []] - tags to remove from the item
   * @returns {Promise}
   */

  modifyGenre (sectionId, type, id, addTags, removeTags = []) {
    const options = addTags.reduce((obj, tag, i) => {
      obj[`genre[${i}].tag.tag`] = tag
      return obj
    }, {})

    if (removeTags.length > 0) {
      options['genre[].tag.tag-'] = removeTags.map(encodeURIComponent).join(',')
    }

    const params = qs.stringify({
      ...options,
      type,
      id,
      'genre.locked': 1,
    })

    return this.api.putQuery(`/library/sections/${sectionId}/all?${params}`)
  }

  /**
   * Modify the genre tags for an album
   */

  modifyAlbumGenre (sectionId, albumId, addTags, removeTags) {
    return this.modifyGenre(sectionId, ALBUM, albumId, addTags, removeTags)
  }

  /**
   * Modify the genre tags for an artist
   */

  modifyArtistGenre (sectionId, artistId, addTags, removeTags) {
    return this.modifyGenre(sectionId, ARTIST, artistId, addTags, removeTags)
  }
}
