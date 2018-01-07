import { normalize as normalizeSchema, schema } from 'normalizr'

import { albumSchema, albumContainerSchema } from './types/album'
import { artistSchema, artistContainerSchema } from './types/artist'
import { hubSchema, hubContainerSchema } from './types/hub'
import { playlistSchema, playlistContainerSchema } from './types/playlist'
import { playQueueItemSchema, playQueueContainerSchema } from './types/playQueue'
import { connectionSchema, deviceSchema, resourceContainerSchema } from './types/resources'
import { sectionSchema, sectionContainerSchema } from './types/section'
import { trackSchema, trackContainerSchema } from './types/track'

/**
 * Normalize a __parsed__ plex response based on the data type.
 * This is done based on the `_type` property all plex objects are given.
 *
 * @param {Object} data - parsed plex response
 * @returns {Object} normalized plex response
 */

const dataSchema = new schema.Union({
  album: albumSchema,
  albumContainer: albumContainerSchema,

  artist: artistSchema,
  artistContainer: artistContainerSchema,

  hub: hubSchema,
  hubContainer: hubContainerSchema,

  playlist: playlistSchema,
  playlistContainer: playlistContainerSchema,

  playQueueItem: playQueueItemSchema,
  playQueueContainer: playQueueContainerSchema,

  connection: connectionSchema,
  device: deviceSchema,
  resourceContainer: resourceContainerSchema,

  section: sectionSchema,
  sectionContainer: sectionContainerSchema,

  track: trackSchema,
  trackContainer: trackContainerSchema
}, '_type')

/*
 * normalizeSync
 *
 * Accepts an object
 *
 * Returns an object
 */
export function normalizeSync (data) {
  return normalizeSchema(data, dataSchema)
}

/*
 * normalize
 *
 * Accepts an object or a promise of an object
 *
 * Returns a promise
 */
export default function normalize (data) {
  return Promise.resolve(data).then(normalizeSync)
}
