import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseGenre, parseCountry} from './tags'

export const artistSchema = new schema.Entity('artists')
export const artistContainerSchema = new schema.Object({
  artists: new schema.Array(artistSchema),
})

export function parseArtist (data) {
  const {
    ratingKey = null,
    key = null,
    type = null,
    title = null,
    summary = null,
    index = null,
    viewCount = null,
    lastViewedAt = null,
    thumb = null,
    art = null,
    addedAt = null,
    updatedAt = null,
    titleSort = null,
  } = data

  return {
    ...parseGenre(data),
    ...parseCountry(data),

    _type: 'artist',
    id: parseInt(ratingKey, 10),

    ratingKey,
    key,
    type,
    title,
    summary,
    index,
    viewCount,
    lastViewedAt,
    thumb,
    art,
    addedAt,
    updatedAt,
    titleSort,
  }
}

export function parseArtistContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    allowSync = null,
    art = null,
    identifier = null,
    librarySectionID = null,
    librarySectionTitle = null,
    librarySectionUUID = null,
    nocache = null,
    offset = null,
    thumb = null,
    title1 = null,
    title2 = null,
    viewGroup = null,
    viewMode = null,
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),

    _type: 'artistContainer',

    allowSync,
    art,
    identifier,
    librarySectionID,
    librarySectionTitle,
    librarySectionUUID,
    nocache,
    offset,
    thumb,
    title1,
    title2,
    viewGroup,
    viewMode,
    artists: Metadata.map(parseArtist),
  }
}
