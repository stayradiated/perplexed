import {schema} from 'normalizr'

import {parseTrack, trackSchema} from './track'
import {parseMediaContainer} from './mediaContainer'
import {parseBool} from './types'

export const playlistItemSchema = new schema.Object({
  track: trackSchema,
})
export const playlistSchema = new schema.Entity('playlists', {
  items: new schema.Array(playlistItemSchema),
})
export const playlistContainerSchema = new schema.Object({
  playlists: new schema.Array(playlistSchema),
})

export const parsePlaylistItem = (playlistId) => (item) => {
  return {
    _type: 'playlistItem',
    id: item.playlistItemID,
    playlistId,
    track: parseTrack(item),
  }
}

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

  const id = parseInt(ratingKey, 10)

  return {
    ...parseMediaContainer(data),
    _type: 'playlist',
    id,
    ratingKey,
    key,
    guid,
    type,
    title,
    summary,
    smart: parseBool(smart),
    playlistType,
    composite,
    viewCount,
    lastViewedAt,
    duration,
    leafCount,
    addedAt,
    updatedAt,
    items: Metadata.map(parsePlaylistItem(id)),
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
