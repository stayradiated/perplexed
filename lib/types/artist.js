import {schema} from 'normalizr'

import parseMediaContainer from './mediaContainer'
import {parseGenre, parseCountry} from './tags'

export const artistSchema = new schema.Entity('artists')
export const artistContainerSchema = new schema.Object({
  items: new schema.Array(artistSchema),
})

export function parseArtist (data) {
  const artist  = {
    ...parseGenre(data),
    ...parseCountry(data),
  }

  artist.ratingKey    = data.ratingKey
  artist.key          = data.key
  artist.type         = data.type
  artist.title        = data.title
  artist.summary      = data.summary
  artist.index        = data.index
  artist.viewCount    = data.viewCount
  artist.lastViewedAt = data.lastViewedAt
  artist.thumb        = data.thumb
  artist.art          = data.art
  artist.addedAt      = data.addedAt
  artist.updatedAt    = data.updatedAt
  artist.titleSort    = data.titleSort

  artist.id = parseInt(artist.ratingKey, 10)

  return artist
}

export function parseArtistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const artistContainer = {
    ...parseMediaContainer(data),
  }

  artistContainer.allowSync           = data.allowSync
  artistContainer.art                 = data.art
  artistContainer.identifier          = data.identifier
  artistContainer.librarySectionID    = data.librarySectionID
  artistContainer.librarySectionTitle = data.librarySectionTitle
  artistContainer.librarySectionUUID  = data.librarySectionUUID
  artistContainer.nocache             = data.nocache
  artistContainer.offset              = data.offset
  artistContainer.thumb               = data.thumb
  artistContainer.title1              = data.title1
  artistContainer.title2              = data.title2
  artistContainer.viewGroup           = data.viewGroup
  artistContainer.viewMode            = data.viewMode

  artistContainer.items = (data.Metadata || []).map(parseArtist)

  return artistContainer
}
