import {normalize} from 'normalizr'
import assert from 'assert'

import {withContainerParams} from './utils/params'
import {parseSectionContainer} from './types/section'
import {albumContainerSchema, parseAlbumContainer} from './types/album'
import {artistContainerSchema, parseArtistContainer} from './types/artist'
import {trackContainerSchema, parseTrackContainer} from './types/track'
import {playQueueSchema, parsePlayQueue} from './types/playQueue'
import {playlistSchema, playlistContainerSchema, parsePlaylist, parsePlaylistContainer} from './types/playlist'
import {hubContainerSchema, parseHubContainer} from './types/hub'

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

  fetchJSON (url, options = {}) {
    return this.api.fetchJSON(url, {
      ...options,
      params: withContainerParams(options.params),
    })
  }

  // ==========================================================================
  // LIBRARY
  // ==========================================================================

  /**
   * Get all available sections in the library
   * @returns {Promise}
   */

  sections () {
    return this.fetchJSON('/library/sections')
      .then((res) => parseSectionContainer(res))
  }

  /**
   * Get a specific section in the library
   *
   * @param {number} sectionId - the id of the section to get
   * @returns {Promise}
   */

  section (sectionId) {
    return this.fetchJSON(`/library/sections/${sectionId}`)
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
    return this.fetchJSON(path, {
      params: {
        ...params,
        type,
        sort: 'addedAt:desc',
      },
    })
      .then((res) => parseType(type, res))
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
    return this.fetchJSON(path, {params})
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
    return this.fetchJSON(path, {params})
      .then((res) => parseType(type, res))
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
   * @returns {Promise}
   */

  artist (artistId) {
    return this.metadata(artistId, ARTIST)
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

  playlists (params) {
    const path = '/playlists/all'
    return this.fetchJSON(path, {
      params: {
        ...params,
        type: PLAYLIST,
        sort: 'titleSort:asc',
      },
    })
      .then((res) => parsePlaylistContainer(res))
  }

  normalizedPlaylists (params) {
    return this.playlists(params)
      .then((data) => normalize(data, playlistContainerSchema))
  }

  playlist (id) {
    return this.fetchJSON(`/playlists/${id}`)
      .then((res) => parsePlaylistContainer(res))
      .then((data) => (data.length > 0 ? data[0] : null))
  }

  normalizedPlaylist (id) {
    return this.playlist(id)
      .then((data) => normalize(data, playlistSchema))
  }

  playlistTracks (id, params) {
    const path = `/playlists/${id}/items`
    return this.fetchJSON(path, {params})
      .then((res) => parsePlaylist(res))
  }

  normalizedPlaylistTracks (id, params) {
    return this.playlistTracks(id, params)
      .then((data) => normalize(data, playlistSchema))
  }

  addToPlaylist (playlistId, uri) {
    return this.fetchJSON(`/playlists/${playlistId}/items`, {
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
    return this.fetchJSON('/hubs/search', {
      params: {
        query,
        limit,
      },
    })
      .then((res) => parseHubContainer(res))
  }

  normalizedSearchAll (query, limit) {
    return this.searchAll(query, limit)
      .then((data) => normalize(data, hubContainerSchema))
  }

  /**
   * Search the library for tracks matching a query
   *
   * @param {string} query
   */

  searchTracks (query) {
    return this.fetchJSON('/library/sections/1/search', {
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
    this.api.getUrl('/photo/:/transcode', params)
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
    return this.fetchJSON('/:/rate', {
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
   * @param {string} [options.uri]
   * @param {number} [options.playlistId]
   * @param {number} [options.key]
   * @param {boolean} [options.shuffle]
   * @param {boolean} [options.repeat]
   * @param {boolean} [options.includeChapters]
   * @param {boolean} [options.includeRelated]
   * @returns {Promise}
   */

  createQueue (options = {}) {
    return this.fetchJSON('/playQueues', {
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
    return this.fetchJSON('/:/timeline', {
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
