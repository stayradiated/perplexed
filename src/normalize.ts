import { normalize as normalizeSchema, schema } from 'normalizr'

import { Album, albumSchema, albumContainerSchema } from './types/album'
import { Artist, artistSchema, artistContainerSchema } from './types/artist'
import { hubSchema, hubContainerSchema } from './types/hub'
import {
  Playlist,
  playlistSchema,
  playlistContainerSchema,
} from './types/playlist'
import {
  playQueueItemSchema,
  playQueueContainerSchema,
} from './types/playQueue'
import {
  connectionSchema,
  deviceSchema,
  deviceContainerSchema,
} from './types/device'
import { resourceContainerSchema } from './types/resources'
import { sectionSchema, sectionContainerSchema } from './types/section'
import { Track, trackSchema, trackContainerSchema } from './types/track'

export interface Normalized<T> {
  entities: {
    albums?: Record<string, Album>,
    artists?: Record<string, Artist>,
    playlists?: Record<string, Playlist>,
    tracks?: Record<string, Track>,
  },
  result: {
    schema: string,
    id: T,
  },
}

/**
 * @ignore
 *
 * Normalize a __parsed__ plex response based on the data type.
 * This is done based on the `_type` property all plex objects are given.
 *
 * @param {Object} data - parsed plex response
 * @returns {Object} normalized plex response
 */

const dataSchema = new schema.Union(
  {
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
    deviceContaienr: deviceContainerSchema,

    section: sectionSchema,
    sectionContainer: sectionContainerSchema,

    track: trackSchema,
    trackContainer: trackContainerSchema,
  },
  '_type',
)

/*
 * normalizeSync
 *
 * Accepts an object
 *
 * Returns an object
 */
export function normalizeSync<T = any> (
  data: Record<string, any>,
): Normalized<T> {
  return normalizeSchema(data, dataSchema)
}

/*
 * normalize
 *
 * Accepts an object or a promise of an object
 *
 * Returns a promise
 */
export default async function normalize<T = any> (
  promise: Promise<Record<string, any>>,
): Promise<Normalized<T>> {
  const resolvedData = await promise
  return normalizeSync<T>(resolvedData)
}
