import { schema } from 'normalizr'

import { parseAlbum, albumSchema } from './album'
import { parseArtist, artistSchema } from './artist'
import { parseTrack, trackSchema } from './track'
import { parsePlaylist, playlistSchema } from './playlist'

export const hubSchema = new schema.Entity('hubs', {
  items: new schema.Array(new schema.Union({
    playlist: playlistSchema,
    artist: artistSchema,
    album: albumSchema,
    track: trackSchema
  }, 'type'))
}, {
  idAttribute: 'type'
})
export const hubContainerSchema = new schema.Object({
  hubs: new schema.Array(hubSchema)
})

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
  const {
    type = null,
    hubIdentifier = null,
    size = null,
    title = null,
    more = null,
    Metadata = []
  } = data

  const parseFn = getParseFunction(type)

  // dedupe items without changing the order
  const items = Metadata.map(parseFn).filter((itemA, index, array) => {
    return array.slice(index + 1).findIndex((itemB) => {
      return itemB.id === itemA.id
    }) < 0
  })

  return {
    _type: 'hub',
    type,
    hubIdentifier,
    size,
    title,
    more,
    items
  }
}

export function parseHubContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    Hub = []
  } = data

  return {
    _type: 'hubContainer',
    hubs: Hub.map(parseHub)
  }
}
