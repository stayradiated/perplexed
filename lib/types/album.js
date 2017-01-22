import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseGenre} from './tags'

export const albumSchema = new schema.Entity('albums')
export const albumContainerSchema = new schema.Object({
  albums: new schema.Array(albumSchema),
})

export function parseAlbum (data) {
  const {
    addedAt = null,
    allowSync = null,
    index = null,
    key = null,
    lastViewedAt = null,
    leafCount = null,
    librarySectionID = null,
    librarySectionTitle = null,
    librarySectionUUID = null,
    originallyAvailableAt = null,
    parentKey = null,
    parentRatingKey = null,
    parentThumb = null,
    parentTitle = null,
    ratingKey = null,
    studio = null,
    summary = null,
    thumb = null,
    title = null,
    type = null,
    updatedAt = null,
    userRating = null,
    viewCount = null,
    year = null,
  } = data

  return {
    ...parseGenre(data),

    _type: 'album',
    id: parseInt(ratingKey, 10),

    addedAt,
    allowSync,
    index,
    key,
    lastViewedAt,
    leafCount,
    librarySectionID,
    librarySectionTitle,
    librarySectionUUID,
    originallyAvailableAt,
    parentKey,
    parentRatingKey,
    parentThumb,
    parentTitle,
    ratingKey,
    studio,
    summary,
    thumb,
    title,
    type,
    userRating,
    updatedAt,
    viewCount,
    year,
  }
}

export function parseAlbumContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    allowSync = null,
    art = null,
    mixedParents = null,
    nocache = null,
    thumb = null,
    title1 = null,
    title2 = null,
    viewGroup = null,
    viewMode = null,
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),

    _type: 'albumContainer',
    albums: Metadata.map(parseAlbum),

    allowSync,
    art,
    mixedParents,
    nocache,
    thumb,
    title1,
    title2,
    viewGroup,
    viewMode,
  }
}
