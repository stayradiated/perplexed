import ServerConnection from './server-connection'

import { RequestOptions } from './utils/request'
import { Params, withParams, withContainerParams } from './utils/params'

import { parseSectionContainer } from './types/section'
import { parseAlbumContainer } from './types/album'
import { parseArtistContainer } from './types/artist'
import { Track, parseTrackContainer } from './types/track'
import { parsePlayQueue } from './types/playQueue'
import { parsePlaylist, parsePlaylistContainer } from './types/playlist'
import { parseHubContainer } from './types/hub'
import { parseCountryContainer } from './types/country'
import { parseGenreContainer } from './types/genre'

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

export function parseType (type: number, data: Record<string, any>) {
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
  public api: ServerConnection

  constructor (serverConnection: ServerConnection) {
    this.api = serverConnection
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Query the API for a limited set of results. By default Plex will return
   * everything that matches, which in most cases can be far too much data.
   */

  async fetch (url: string, options: RequestOptions = {}) {
    const res = await this.api.fetch(url, {
      ...options,
      params: withContainerParams(options.params),
    })
    return res
  }

  // ==========================================================================
  // LIBRARY
  // ==========================================================================

  /**
   * Get the status of all connected clients
   */

  async sessions () {
    const res = await this.fetch('/status/sessions')
    return res
  }

  /**
   * Get all available sections in the library
   * @returns {Promise}
   */

  async sections () {
    const res = await this.fetch('/library/sections')
    return parseSectionContainer(res)
  }

  /**
   * Get a specific section in the library
   *
   * @param {number} sectionId - the id of the section to get
   * @returns {Promise}
   */

  async section (sectionId: number) {
    const res = await this.fetch(`/library/sections/${sectionId}`)
    return res
  }

  /**
   * Get all items in a section
   *
   * @param {number} sectionId
   * @param {number} type
   * @param {Object} [params={}]
   * @returns {Promise}
   */

  async sectionItems (sectionId: number, type: number, params: Params = {}) {
    const path = `/library/sections/${sectionId}/all`
    const res = await this.fetch(path, {
      params: {
        ...params,
        type,
      },
    })
    return parseType(type, res)
  }

  /**
   * Build library URI for use in creating queues and playlists
   *
   * @param {string} uuid - library UUID
   * @param {string} path - library path
   * @param {Object} [params] - path params
   * @returns {string}
   */

  buildLibraryURI (uuid: string, path: string, params: Params = {}) {
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

  async metadata (id: number, type: number, params: Params = {}) {
    const path = `/library/metadata/${id}`
    const res = await this.fetch(path, { params })
    return parseType(type, res)
  }

  /**
   * Fetch children of a metadata item
   *
   * @param {number} id
   * @param {number} type
   * @param {Object} [params] - params to add to the request
   * @returns {Promise}
   */

  async metadataChildren (id: number, type: number, params: Params = {}) {
    const path = `/library/metadata/${id}/children`
    const res = await this.fetch(path, { params })
    return parseType(type, res)
  }

  // ==========================================================================
  // COUNTRIES
  // ==========================================================================

  async countries (sectionId: number) {
    const path = `/library/sections/${sectionId}/country`
    const res = await this.fetch(path)
    return parseCountryContainer(res)
  }

  // ==========================================================================
  // GENRES
  // ==========================================================================

  async genres (sectionId: number) {
    const path = `/library/sections/${sectionId}/genre`
    const res = await this.fetch(path)
    return parseGenreContainer(res)
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

  async tracks (sectionId: number, params: Params = {}) {
    const tracks = await this.sectionItems(sectionId, TRACK, params)
    return tracks
  }

  /**
   * Get information about a single track
   *
   * @param {number} trackId
   * @returns {Promise}
   */

  async track (trackId: number) {
    const track = await this.metadata(trackId, TRACK)
    return track
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

  async albums (sectionId: number, params: Params = {}) {
    const albums = await this.sectionItems(sectionId, ALBUM, params)
    return albums
  }

  /**
   * Get information about a single album
   *
   * @param {number} albumId
   * @returns {Promise}
   */

  async album (albumId: number) {
    const album = await this.metadata(albumId, ALBUM)
    return album
  }

  /**
   * Get the tracks related to an album
   *
   * @param {number} albumId
   * @param {Object} [params]
   * @param {boolean} [params.includeRelated=false]
   * @returns {Promise}
   */

  async albumTracks (albumId: number, params: Params = {}) {
    const albumTracks = await this.metadataChildren(albumId, TRACK, params)
    return albumTracks
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

  async artists (sectionId: number, params: Params = {}) {
    const artists = await this.sectionItems(sectionId, ARTIST, params)
    return artists
  }

  /**
   * Get information about a single artist
   *
   * @param {number} artistId
   * @param {Object} [options={}]
   * @param {boolean} [options.includePopular=false]
   * @returns {Promise}
   */

  async artist (artistId: number, options: { includePopular?: boolean } = {}) {
    const { includePopular = false } = options
    const artist = await this.metadata(artistId, ARTIST, {
      includePopularLeaves: includePopular ? 1 : 0,
    })
    return artist
  }

  /**
   * Get the albums related to an artist
   *
   * @param {number} artistId
   * @param {Object} [params]
   * @param {boolean} [params.includeRelated=false]
   * @returns {Promise}
   */

  async artistAlbums (artistId: number, params: Params) {
    const artistAlbums = await this.metadataChildren(artistId, ALBUM, params)
    return artistAlbums
  }

  // ==========================================================================
  // PLAYLISTS
  // ==========================================================================

  async createSmartPlaylist (title: string, uri: string) {
    const res = await this.fetch('/playlists', {
      method: 'POST',
      params: {
        type: 'audio',
        title,
        smart: 1,
        uri,
      },
    })
    return parsePlaylistContainer(res)
  }

  /**
   * Fetch all playlists on the server
   *
   * @params {Obect} params
   * @params {string} [params.playlistType] - filter playlists by the type of
   * playlist they are
   * @returns {Promise}
   */

  async playlists (params: Params = {}) {
    const path = '/playlists/all'
    const res = await this.fetch(path, {
      params: {
        ...params,
        type: PLAYLIST,
      },
    })
    return parsePlaylistContainer(res)
  }

  async playlist (id: number) {
    const res = await this.fetch(`/playlists/${id}`)
    return parsePlaylistContainer(res)
  }

  async playlistTracks (id: number, params: Params = {}) {
    const path = `/playlists/${id}/items`
    const res = await this.fetch(path, { params })
    return parsePlaylist(res)
  }

  async editPlaylistDetails (playlistId: number, params: Params = {}) {
    const res = await this.fetch(`/library/metadata/${playlistId}`, {
      method: 'PUT',
      params,
    })
    return res
  }

  async editPlaylistTitle (playlistId: number, title: string) {
    const res = await this.editPlaylistDetails(playlistId, { title })
    return res
  }

  async editPlaylistSummary (playlistId: number, summary: string) {
    const res = await this.editPlaylistDetails(playlistId, { summary })
    return res
  }

  async addToPlaylist (playlistId: number, uri: string) {
    const res = await this.fetch(`/playlists/${playlistId}/items`, {
      method: 'PUT',
      params: {
        uri,
      },
    })
    return res
  }

  async movePlaylistItem (playlistId: number, itemId: number, afterId: number) {
    const res = await this.fetch(
      `/playlists/${playlistId}/items/${itemId}/move`,
      {
        method: 'PUT',
        params: {
          after: afterId,
        },
      },
    )
    return res
  }

  async deletePlaylist (playlistId: number) {
    const res = await this.fetch(`/playlists/${playlistId}`, {
      method: 'DELETE',
    })
    return res
  }

  /**
   * Remove an item from a playlist
   *
   * @params {number} playlistId - ID of the playlist
   * @params {number} itemId - ID of the item to remove
   * @returns {Promise}
   */

  async removeFromPlaylist (playlistId: number, itemId: number) {
    const res = await this.fetch(`/playlists/${playlistId}/items/${itemId}`, {
      method: 'DELETE',
    })
    return res
  }

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  async searchAll (query: string, limit = 3) {
    const res = await this.fetch('/hubs/search', {
      params: {
        query,
        limit,
      },
    })
    return parseHubContainer(res)
  }

  /**
   * Search the library for tracks matching a query
   *
   * @param {string} query
   */

  async searchTracks (sectionId: number, query: string) {
    const res = await this.fetch(`/library/sections/${sectionId}/search`, {
      params: {
        type: TRACK,
        query,
      },
    })
    return res
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

  resizePhoto (params: Params = {}) {
    return this.api.getAuthenticatedUrl('/photo/:/transcode', params)
  }

  // ==========================================================================
  // TRACKS
  // ==========================================================================

  trackSrc (track: Track) {
    return this.api.getAuthenticatedUrl(track.media[0].parts[0].key)
  }

  trackLyrics (track: Track) {
    const streams = track.media[0].parts[0].streams
    const lyricStream = streams.find((stream) => stream.format === 'txt')
    if (lyricStream == null) {
      return null
    }
    return this.api.getAuthenticatedUrl(lyricStream.key)
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

  async rate (trackId: number, rating: number) {
    const res = await this.fetch('/:/rate', {
      params: {
        key: trackId,
        identifier: 'com.plexapp.plugins.library',
        rating,
      },
    })
    return res
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

  async createQueue (
    options: {
      uri?: string,
      playlistId?: number,
      key?: number,
      shuffle?: boolean,
      repeat?: boolean,
      includeChapters?: number,
      includeRelated?: number,
    } = {},
  ) {
    const res = await this.fetch('/playQueues', {
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
    return parseType(QUEUE, res)
  }

  /**
   * Fetch information about an existing play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  async playQueue (playQueueId: number) {
    const res = await this.fetch(`/playQueues/${playQueueId}`)
    return parseType(QUEUE, res)
  }

  /**
   * Move an item in the play queue to a new position
   *
   * @param {Number} playQueueId
   * @param {Number} itemId
   * @param {Number} afterId
   * @returns Promise
   */

  async movePlayQueueItem (
    playQueueId: number,
    itemId: number,
    afterId: number,
  ) {
    const res = await this.fetch(
      `/playQueues/${playQueueId}/items/${itemId}/move`,
      {
        method: 'PUT',
        params: {
          after: afterId,
        },
      },
    )
    return parseType(QUEUE, res)
  }

  /**
   * Shuffle a play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  async shufflePlayQueue (playQueueId: number) {
    const res = await this.fetch(`/playQueues/${playQueueId}/shuffle`, {
      method: 'PUT',
    })
    return parseType(QUEUE, res)
  }

  /**
   * Unshuffle a play queue
   *
   * @param {Number} playQueueId
   * @returns Promise
   */

  async unshufflePlayQueue (playQueueId: number) {
    const res = await this.fetch(`/playQueues/${playQueueId}/unshuffle`, {
      method: 'PUT',
    })
    return parseType(QUEUE, res)
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

  async timeline (options: {
    queueItemId: number,
    ratingKey: string,
    key: number,
    playerState: string,
    currentTime: number,
    duration: number,
  }) {
    const {
      currentTime,
      duration,
      queueItemId,
      ratingKey,
      key,
      playerState,
    } = options
    const res = await this.fetch('/:/timeline', {
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
    return res
  }

  // ==========================================================================
  // MODIFY LIST
  // ==========================================================================

  async modifyListField (
    prop: string,
    sectionId: number,
    type: number,
    id: number,
    addTags: string[] = [],
    removeTags: string[] = [],
  ) {
    const params = addTags.reduce<Record<string, string>>((obj, tag, i) => {
      obj[`${prop}[${i}].tag.tag`] = tag
      return obj
    }, {})

    if (removeTags.length > 0) {
      params[`${prop}[].tag.tag-`] = removeTags
        .map(encodeURIComponent)
        .join(',')
    }

    const res = await this.api.fetch(`/library/sections/${sectionId}/all`, {
      method: 'PUT',
      params: {
        ...params,
        type,
        id,
        [`${prop}.locked`]: 1,
      },
    })
    return res
  }

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

  async modifyGenre (
    sectionId: number,
    type: number,
    id: number,
    add: string[],
    remove?: string[],
  ) {
    return this.modifyListField('genre', sectionId, type, id, add, remove)
  }

  /**
   * Modify the genre tags for an album
   */

  async modifyAlbumGenre (
    sectionId: number,
    albumId: number,
    add: string[],
    remove?: string[],
  ) {
    const res = await this.modifyGenre(sectionId, ALBUM, albumId, add, remove)
    return res
  }

  /**
   * Modify the genre tags for an artist
   */

  async modifyArtistGenre (
    sectionId: number,
    artistId: number,
    add: string[],
    remove?: string[],
  ) {
    const res = await this.modifyGenre(sectionId, ARTIST, artistId, add, remove)
    return res
  }

  async modifyCollection (
    sectionId: number,
    type: number,
    id: number,
    add: string[],
    remove?: string[],
  ) {
    return this.modifyListField('collection', sectionId, type, id, add, remove)
  }

  async modifyAlbumCollection (
    sessionId: number,
    albumId: number,
    add: string[],
    remove?: string[],
  ) {
    return this.modifyCollection(sessionId, ALBUM, albumId, add, remove)
  }
}
