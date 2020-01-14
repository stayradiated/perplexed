import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { toAlbum, albumSchema } from './album'
import { toArtist, artistSchema } from './artist'
import { toTrack, trackSchema } from './track'
import { toPlaylist, playlistSchema } from './playlist'

/**
 * @ignore
 */
const hubSchema = new schema.Entity(
  'hubs',
  {
    items: new schema.Array(
      new schema.Union(
        {
          playlist: playlistSchema,
          artist: artistSchema,
          album: albumSchema,
          track: trackSchema,
        },
        'type',
      ),
    ),
  },
  {
    idAttribute: 'type',
  },
)

/**
 * @ignore
 */
const hubContainerSchema = new schema.Object({
  hubs: new schema.Array(hubSchema),
})

/**
 * @ignore
 */
type TransformFunction = ($data: Prism<any>) => Record<string, any>

/**
 * @ignore
 */
const defaultTransformFunction: TransformFunction = ($data) => $data.value

/**
 * @ignore
 */
const getTransformFunction = (type: string): TransformFunction => {
  switch (type) {
    case 'album':
      return toAlbum
    case 'artist':
      return toArtist
    case 'track':
      return toTrack
    case 'playlist':
      return toPlaylist
    default:
      return defaultTransformFunction
  }
}

/**
 * @ignore
 */
const toHub = ($data: Prism<any>) => {
  const transformFunction = getTransformFunction($data.get('type').value)

  // dedupe items without changing the order
  const items = $data
    .get('Metadata', { quiet: true })
    .toArray()
    .map(transformFunction)
    .filter((itemA, index, array) => {
      return (
        array.slice(index + 1).findIndex((itemB) => {
          return itemB.id === itemA.id
        }) < 0
      )
    })

  return {
    _type: 'hub',
    type: $data.get('type').value,
    hubIdentifier: $data.get('hubIdentifier').value,
    size: $data.get('size').value,
    title: $data.get('title').value,
    more: $data.get('more').value,
    items,
  }
}

/**
 * @ignore
 */
const toHubContainer = ($data: Prism<any>) => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    _type: 'hubContainer',
    hubs: $data
      .get('Hub')
      .toArray()
      .map(toHub),
  }
}

/**
 * @ignore
 */
const parseHubContainer = createParser('hubContainer', toHubContainer)

export { hubSchema, hubContainerSchema, parseHubContainer }
