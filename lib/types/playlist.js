import {schema} from 'normalizr'

import {parseTrack, trackSchema} from './track'
import {parseMediaContainer} from './mediaContainer'

export const playlistSchema = new schema.Entity('playlists', {
  tracks: new schema.Array(trackSchema),
})
export const playlistContainerSchema = new schema.Object({
  playlists: new schema.Array(playlistSchema),
})

export function parsePlaylist (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    ratingKey = null,
    key = null,
    guid = null,
    type = null,
    title = null,
    summary = null,
    smart = null,
    playlistType = null,
    composite = null,
    viewCount = null,
    lastViewedAt = null,
    duration = null,
    leafCount = null,
    addedAt = null,
    updatedAt = null,
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),
    _type: 'playlist',
    id: parseInt(ratingKey, 10),
    ratingKey,
    key,
    guid,
    type,
    title,
    summary,
    smart,
    playlistType,
    composite,
    viewCount,
    lastViewedAt,
    duration,
    leafCount,
    addedAt,
    updatedAt,
    tracks: Metadata.map(parseTrack),
  }
}

export function parsePlaylistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),

    _type:'playlistContainer',
    playlists: Metadata.map(parsePlaylist),
  }
}
