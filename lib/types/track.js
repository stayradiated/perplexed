import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseMedia} from './media'

export const trackSchema = new schema.Entity('tracks')
export const trackContainerSchema = new schema.Object({
  tracks: new schema.Array(trackSchema),
})

export function parseTrack (data) {
  const {
    addedAt = null,
    duration = null,
    grandparentKey = null,
    grandparentRatingKey = null,
    grandparentThumb = null,
    grandparentTitle = null,
    index = null,
    key = null,
    lastViewedAt = null,
    originalTitle = null,
    parentIndex = null,
    parentKey = null,
    parentRatingKey = null,
    parentThumb = null,
    parentTitle = null,
    ratingCount = null,
    ratingKey = null,
    summary = null,
    thumb = null,
    title = null,
    type = null,
    updatedAt = null,
    userRating = null,
    viewCount = null,
    Media = [],
    Related = null,
  } = data

  return {
    _type: 'track',
    id: parseInt(ratingKey, 10),
    media: Media.map(parseMedia),
    plexMix: Related && Related.Directory,

    addedAt,
    duration,
    grandparentKey,
    grandparentRatingKey,
    grandparentThumb,
    grandparentTitle,
    index,
    key,
    lastViewedAt,
    originalTitle,
    parentIndex,
    parentKey,
    parentRatingKey,
    parentThumb,
    parentTitle,
    ratingCount,
    ratingKey,
    summary,
    thumb,
    title,
    type,
    updatedAt,
    userRating,
    viewCount,
  }
}

export function parseTrackContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    allowSync = null,
    art = null,
    grandparentRatingKey = null,
    grandparentThumb = null,
    grandparentTitle = null,
    key = null,
    librarySectionID = null,
    librarySectionTitle = null,
    librarySectionUUID = null,
    nocache = null,
    offset = null,
    parentIndex = null,
    parentTitle = null,
    parentYear = null,
    thumb = null,
    title1 = null,
    title2 = null,
    viewGroup = null,
    viewMode = null,
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),

    _type: 'trackContainer',
    tracks: Metadata.map(parseTrack),

    allowSync,
    art,
    grandparentRatingKey,
    grandparentThumb,
    grandparentTitle,
    key,
    librarySectionID,
    librarySectionTitle,
    librarySectionUUID,
    nocache,
    offset,
    parentIndex,
    parentTitle,
    parentYear,
    thumb,
    title1,
    title2,
    viewGroup,
    viewMode,
  }
}
