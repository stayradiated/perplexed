import {parseTrack} from './track'

export function parsePlaylist (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const playlist = {}

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

  if (data.Metadata != null) {
    playlist.items = data.Metadata.map(parseTrack)
  }

  return playlist
}

export function parsePlaylistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  return data.Metadata.map(parsePlaylist)
}
