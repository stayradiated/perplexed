import {schema} from 'normalizr'

import parseMediaContainer from './mediaContainer'

export const artistSchema = new schema.Entity('artists')
export const artistContainerSchema = new schema.Object({
  items: new schema.Array(artistSchema),
})

export function parseArtist (data) {
  const artist  = {...data}

  return artist
}

export function parseArtistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const artistContainer = {
    ...data,
    ...parseMediaContainer(data),
  }

  artistContainer.items = data.Metadata.map(parseArtist)

  return artistContainer
}
