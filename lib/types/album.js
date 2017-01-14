import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseGenre} from './tags'

export const albumSchema = new schema.Entity('albums')
export const albumContainerSchema = new schema.Object({
  albums: new schema.Array(albumSchema),
})

export function parseAlbum (data) {
  const {
    allowSync = null,
    librarySectionID = null,
    librarySectionTitle = null,
    librarySectionUUID = null,
    ratingKey = null,
    key = null,
    parentRatingKey = null,
    studio = null,
    type = null,
    title = null,
    parentKey = null,
    parentTitle = null,
    summary = null,
    index = null,
    viewCount = null,
    lastViewedAt = null,
    year = null,
    thumb = null,
    parentThumb = null,
    originallyAvailableAt = null,
    leafCount = null,
    addedAt = null,
    updatedAt = null,
  } = data

  return {
    ...parseGenre(data),

    _type: 'album',
    id: parseInt(ratingKey, 10),

    allowSync,
    librarySectionID,
    librarySectionTitle,
    librarySectionUUID,
    ratingKey,
    key,
    parentRatingKey,
    studio,
    type,
    title,
    parentKey,
    parentTitle,
    summary,
    index,
    viewCount,
    lastViewedAt,
    year,
    thumb,
    parentThumb,
    originallyAvailableAt,
    leafCount,
    addedAt,
    updatedAt,
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
