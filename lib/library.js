import assert from 'assert'

import {withParams, withContainerParams} from './utils/params'

import {parseSectionContainer} from './types/section'
import {parseAlbumContainer} from './types/album'
import {parseArtistContainer} from './types/artist'
import {parseTrackContainer} from './types/track'
import {parsePlayQueue} from './types/playQueue'
import {parsePlaylist, parsePlaylistContainer} from './types/playlist'
import {parseHubContainer} from './types/hub'

// plex media types-- https://github.com/Arcanemagus/plex-api/wiki/MediaTypes
export const ARTIST = 8
export const ALBUM = 9
export const TRACK = 10
export const PLAYLIST = 15

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
      return data
  }
}

/**
 * Interact with a plex server
 *
 * @class Library
 * @param {Object|string} config - config to pass to `plex-api` package
 */

export default class Library {

  constructor (serverConnection) {
    this.api = serverConnection
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Query the API for a limited set of results. By default Plex will return
   * everything that matches, which in most cases can be far too much data.
   *
   * @private
   * @param {Object} params - query params
   * @param {number} params.start - first index to return
   * @param {number} params.size - how many items to return to
   * @returns {Promise} - the query result
   */

  fetch (url, options = {}) {
    return this.api.fetch(url, {
      ...options,
      params: withContainerParams(options.params),
    })
  }

  // ==========================================================================
  // LIBRARY
  // ==========================================================================

  /**
   * Get the status of all connected clients
   */

  sessions () {
    return this.fetch('/status/sessions')
  }

  /**
   * Get all available sections in the library
   * @returns {Promise}
   */

  sections () {
    return this.fetch('/library/sections')
      .then((res) => parseSectionContainer(res))
  }

  /**
   * Get a specific section in the library
   *
   * @param {number} sectionId - the id of the section to get
   * @returns {Promise}
   */

  section (sectionId) {
    return this.fetch(`/library/sections/${sectionId}`)
  }

  /**
   * Get all items in a section
   *
   * @param {number} sectionId
   * @param {number} type
   * @param {Object} [params={}]
   * @returns {Promise}
   */

  sectionItems (sectionId, type, params = {}) {
    assert(sectionId != null, 'Must specify section id')
    assert(typeof type === 'number', 'Must specify type')

    const path = `/library/sections/${sectionId}/all`
    return this.fetch(path, {
      params: {
        ...params,
        type,
      },
    })
      .then((res) => parseType(type, res))
  }

  /**
   * Build library URI for use in creating queues and playlists
   *
   * @param {string} uuid - library UUID
   * @param {string} path - library path
   * @param {Object} [params] - path params
   * @returns {string}
   */

  buildLibraryURI (uuid, path, params) {
    const uri = withParams(path, params)
    const encodedURI = encodeURIComponent(uri)
    return `library://${uuid}/directory/${encodedURI}`
  }

  /**
   * Fetch a metadata item
   *
   * @param {number} id
   * @param {number} type
   * @param {Object} [params] - params to add to the request
   * @returns {Promise}
   */

  metadata (id, type, params = {}) {
    assert(id != null, 'Must specify item id')
    assert(typeof type === 'number', 'Must specify type')

    const path = `/library/metadata/${id}`
    return this.fetch(path, {params})
      .then((res) => parseType(type, res))
  }


  /**
   * Fetch children of a metadata item
   *
   * @param {number} id
   * @param {number} type
   * @param {Object} [params] - params to add to the request
   * @returns {Promise}
   */

  metadataChildren (id, type, params = {}) {
    assert(id != null, 'Must specify item id')
    assert(typeof type === 'number', 'Must specify type')

    const path = `/library/metadata/${id}/children`
    return this.fetch(path, {params})
      .then((res) => parseType(type, res))
  }


  // ==========================================================================
  // TRACKS
  // ==========================================================================

  /**
   * Query all the tracks in the library
   *
   * @param {number} sectionId - id of the library section
   * @param {Object} [params={}]
   */

  tracks (sectionId, params = {}) {
    return this.sectionItems(sectionId, TRACK, params)
  }


  /**
   * Get information about a single track
   *
   * @param {number} trackId
   * @returns {Promise}
   */

  track (trackId) {
    return this.metadata(trackId, TRACK)
  }


  // ==========================================================================
  // ALBUMS
  // ==========================================================================

  /**
   * Query all albums in the library
   *
   * @param {number} sectionId - id of the section to fetch
   * @param {Object} [params] - query params
   * @returns {Promise}
   */

  albums (sectionId, params) {
    return this.sectionItems(sectionId, ALBUM, params)
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
   * @param {Object} [params]
   * @param {boolean} [params.includeRelated=false]
   * @returns {Promise}
   */

  albumTracks (albumId, params) {
    return this.metadataChildren(albumId, TRACK, params)
  }


  // ==========================================================================
  // ARTISTS
  // ==========================================================================

  /**
   * Query all artists in the library
   *
   * @param {number} sectionId - id of the library section
   * @param {Object} [params={}]
   */

  artists (sectionId, params = {}) {
    return this.sectionItems(sectionId, ARTIST, params)
  }


  /**
   * Get information about a single artist
   *
   * @param {number} artistId
   * @param {Object} [options={}]
   * @param {boolean} [options.includePopular=false]
   * @returns {Promise}
   */

  artist (artistId, {includePopular = false}) {
    return this.metadata(artistId, ARTIST, {
      includePopularLeaves: includePopular ? 1 : 0,
    })
  }


  /**
   * Get the albums related to an artist
   *
   * @param {number} artistId
   * @param {Object} [params]
   * @param {boolean} [params.includeRelated=false]
   * @returns {Promise}
   */

  artistAlbums (artistId, params) {
    return this.metadataChildren(artistId, ALBUM, params)
  }


  // ==========================================================================
  // PLAYLISTS
  // ==========================================================================

  createSmartPlaylist (title, uri) {
    return this.fetch('/playlists', {
      method: 'POST',
      params: {
        type: 'audio',
        title,
        smart: 1,
        uri,
      },
    })
      .then((res) => parsePlaylistContainer(res))
  }

  /**
   * Fetch all playlists on the server
   *
   * @params {Obect} params
   * @params {string} [params.playlistType] - filter playlists by the type of
   * playlist they are
   * @returns {Promise}
   */

  playlists (params) {
    const path = '/playlists/all'
    return this.fetch(path, {
      params: {
        ...params,
        type: PLAYLIST,
      },
    })
      .then((res) => parsePlaylistContainer(res))
  }

  playlist (id) {
    return this.fetch(`/playlists/${id}`)
      .then((res) => parsePlaylistContainer(res))
  }

  playlistTracks (id, params) {
    const path = `/playlists/${id}/items`
    return this.fetch(path, {params})
      .then((res) => parsePlaylist(res))
  }

  addToPlaylist (playlistId, uri) {
    return this.fetch(`/playlists/${playlistId}/items`, {
      method: 'PUT',
      params: {
        uri,
      },
    })
  }

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  searchAll (query, limit = 3) {
    return this.fetch('/hubs/search', {
      params: {
        query,
        limit,
      },
    })
      .then((res) => parseHubContainer(res))
  }

  /**
   * Search the library for tracks matching a query
   *
   * @param {string} query
   */

  searchTracks (sectionId, query) {
    return this.fetch(`/library/sections/${sectionId}/search`, {
      params: {
        type: TRACK,
        query,
      },
    })
  }


  // ==========================================================================
  // PHOTOS
  // ==========================================================================

  /**
   * Resize a photo to a specific size
   *
   * @params {Object} params
   * @params {string} params.uri
   * @params {number} params.width
   * @params {number} params.height
   * @returns {string}
   */

  resizePhoto (params) {
    return this.api.getAuthenticatedUrl('/photo/:/transcode', params)
  }


  // ==========================================================================
  // TRACKS
  // ==========================================================================

  trackSrc (track) {
    return this.api.getAuthenticatedUrl(track.media[0].part[0].key)
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
    return this.fetch('/:/rate', {
      params: {
        key: trackId,
        identifier: 'com.plexapp.plugins.library',
        rating,
      },
    })
  }


  // ==========================================================================
  // QUEUE
  // ==========================================================================

  /**
   * Create a play queue from a uri
   *
   * @param {Object} options
   * @param {string} [options.uri] - the URI of the list. For an album, this
   * would be the `albumk.key` property.
   * @param {number} [options.playlistId] - if you are using a playlist as the
   * source, set this instead of `uri`
   * @param {number} [options.key] - URI of the track to play first
   * @param {boolean} [options.shuffle]
   * @param {boolean} [options.repeat]
   * @param {boolean} [options.includeChapters]
   * @param {boolean} [options.includeRelated]
   * @returns {Promise}
   */

  createQueue (options = {}) {
    return this.fetch('/playQueues', {
      method: 'POST',
      params: {
        type: 'audio',
        playlistID: options.playlistId,
        uri: options.uri,
        key: options.key,
        shuffle: options.shuffle ? 1 : 0,
        repeat: options.repeat ? 1 : 0,
        includeChapters: options.includeChapters ? 1 : 0,
        includeRelated: options.includeRelated ? 1 : 0,
      },
    })
      .then((res) => parseType(QUEUE, res))
  }

  /**
   * Fetch information about an existing play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  playQueue (playQueueId) {
    return this.fetch(`/playQueues/${playQueueId}`)
      .then((res) => parseType(QUEUE, res))
  }

  /**
   * Move an item in the play queue to a new position
   *
   * @param {Number} playQueueId
   * @param {Number} itemId
   * @param {Number} afterId
   * @returns Promise
   */

  movePlayQueueItem (playQueueId, itemId, afterId) {
    return this.fetch(`/playQueues/${playQueueId}/items/${itemId}/move`, {
      method: 'PUT',
      params: {
        after: afterId,
      },
    })
      .then((res) => parseType(QUEUE, res))
  }

  /**
   * Shuffle a play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  shufflePlayQueue (playQueueId) {
    return this.fetch(`/playQueues/${playQueueId}/shuffle`, {method: 'PUT'})
      .then((res) => parseType(QUEUE, res))
  }

  /**
   * Unshuffle a play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  unshufflePlayQueue (playQueueId) {
    return this.fetch(`/playQueues/${playQueueId}/unshuffle`, {method: 'PUT'})
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
    return this.fetch('/:/timeline', {
      params: {
        hasMDE: 1,
        ratingKey,
        key,
        playQueueItemID: queueItemId,
        state: playerState,
        time: currentTime,
        duration,
      },
    })
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
    const params = addTags.reduce((obj, tag, i) => {
      obj[`genre[${i}].tag.tag`] = tag
      return obj
    }, {})

    if (removeTags.length > 0) {
      params['genre[].tag.tag-'] = removeTags.map(encodeURIComponent).join(',')
    }

    return this.api.fetch(`/library/sections/${sectionId}/all`, {
      method: 'PUT',
      params: {
        ...params,
        type,
        id,
        'genre.locked': 1,
      },
    })
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
