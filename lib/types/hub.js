import {schema} from 'normalizr'

import {parseAlbum, albumSchema} from './album'
import {parseArtist, artistSchema} from './artist'
import {parseTrack, trackSchema} from './track'
import {parsePlaylist, playlistSchema} from './playlist'

export const hubSchema = new schema.Entity('hubs', {
  items: new schema.Array(new schema.Union({
    playlist: playlistSchema,
    artist: artistSchema,
    album: albumSchema,
    track: trackSchema,
  }, 'type')),
}, {
  idAttribute: 'type',
})
export const hubContainerSchema = new schema.Array(hubSchema)

export function defaultParseFunction (data) {
  return data
}

export function getParseFunction (type) {
  switch (type) {
    case 'album':
      return parseAlbum
    case 'artist':
      return parseArtist
    case 'track':
      return parseTrack
    case 'playlist':
      return parsePlaylist
    default:
      return defaultParseFunction
  }
}

export function parseHub (data) {
  const hub = {}

  hub.type          = data.type
  hub.hubIdentifier = data.hubIdentifier
  hub.size          = data.size
  hub.title         = data.title
  hub.more          = data.more

  const parseFn = getParseFunction(hub.type)
  hub.items = (data.Metadata || []).map(parseFn)

  return hub
}

export function parseHubContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  return data.Hub.map(parseHub)
}
