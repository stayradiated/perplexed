import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseGenre, parseCountry} from './tags'

export const artistSchema = new schema.Entity('artists')
export const artistContainerSchema = new schema.Object({
  artists: new schema.Array(artistSchema),
})

export function parseArtist (data) {
  const artist  = {
    ...parseGenre(data),
    ...parseCountry(data),
  }

  artist._type = 'artist'

  if (data.ratingKey != null) {
    artist.ratingKey = data.ratingKey
  }

  if (data.key != null) {
    artist.key = data.key
  }

  if (data.type != null) {
    artist.type = data.type
  }

  if (data.title != null) {
    artist.title = data.title
  }

  if (data.summary != null) {
    artist.summary = data.summary
  }

  if (data.index != null) {
    artist.index = data.index
  }

  if (data.viewCount != null) {
    artist.viewCount = data.viewCount
  }

  if (data.lastViewedAt != null) {
    artist.lastViewedAt = data.lastViewedAt
  }

  if (data.thumb != null) {
    artist.thumb = data.thumb
  }

  if (data.art != null) {
    artist.art = data.art
  }

  if (data.addedAt != null) {
    artist.addedAt = data.addedAt
  }

  if (data.updatedAt != null) {
    artist.updatedAt = data.updatedAt
  }

  if (data.titleSort != null) {
    artist.titleSort = data.titleSort
  }

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

  artistContainer._type = 'artistContainer'

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

  artistContainer.artists = (data.Metadata || []).map(parseArtist)

  return artistContainer
}
