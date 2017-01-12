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

  const playlist = {
    ...parseMediaContainer(data),
  }

  playlist._type = 'playlist'

  playlist.ratingKey    = data.ratingKey
  playlist.key          = data.key
  playlist.guid         = data.guid
  playlist.type         = data.type
  playlist.title        = data.title
  playlist.summary      = data.summary
  playlist.smart        = data.smart
  playlist.playlistType = data.playlistType
  playlist.composite    = data.composite
  playlist.viewCount    = data.viewCount
  playlist.lastViewedAt = data.lastViewedAt
  playlist.duration     = data.duration
  playlist.leafCount    = data.leafCount
  playlist.addedAt      = data.addedAt
  playlist.updatedAt    = data.updatedAt

  playlist.id = parseInt(playlist.ratingKey, 10)

  playlist.tracks = (data.Metadata || []).map(parseTrack)

  return playlist
}

export function parsePlaylistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const playlistContainer = {
    ...parseMediaContainer(data),
  }

  playlistContainer._type = 'playlistContainer'

  playlistContainer.playlists = (data.Metadata || []).map(parsePlaylist)

  return playlistContainer
}
