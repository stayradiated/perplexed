import {schema} from 'normalizr'

import parseMediaContainer from './mediaContainer'
import parseMedia from './media'

export const trackSchema = new schema.Entity('tracks')
export const trackContainerSchema = new schema.Object({
  items: new schema.Array(trackSchema),
})

export function parseTrack (data) {
  const track = {}

  track.addedAt              = data.addedAt
  track.duration             = data.duration
  track.grandparentKey       = data.grandparentKey
  track.grandparentRatingKey = data.grandparentRatingKey
  track.grandparentThumb     = data.grandparentThumb
  track.grandparentTitle     = data.grandparentTitle
  track.index                = data.index
  track.key                  = data.key
  track.lastViewedAt         = data.lastViewedAt
  track.originalTitle        = data.originalTitle
  track.parentIndex          = data.parentIndex
  track.parentKey            = data.parentKey
  track.parentRatingKey      = data.parentRatingKey
  track.parentThumb          = data.parentThumb
  track.parentTitle          = data.parentTitle
  track.ratingCount          = data.ratingCount
  track.ratingKey            = data.ratingKey
  track.summary              = data.summary
  track.thumb                = data.thumb
  track.title                = data.title
  track.type                 = data.type
  track.updatedAt            = data.updatedAt
  track.userRating           = data.userRating
  track.viewCount            = data.viewCount

  track.id = parseInt(track.ratingKey, 10)

  track.media = data.Media.map(parseMedia)

  if (data.Related != null) {
    track.plexMix = data.Related.Directory
  }

  return track
}

export function parseTrackContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const trackContainer = {
    ...parseMediaContainer(data),
  }

  trackContainer.allowSync            = data.allowSync
  trackContainer.art                  = data.art
  trackContainer.grandparentRatingKey = data.grandparentRatingKey
  trackContainer.grandparentThumb     = data.grandparentThumb
  trackContainer.grandparentTitle     = data.grandparentTitle
  trackContainer.key                  = data.key
  trackContainer.librarySectionID     = data.librarySectionID
  trackContainer.librarySectionTitle  = data.librarySectionTitle
  trackContainer.librarySectionUUID   = data.librarySectionUUID
  trackContainer.nocache              = data.nocache
  trackContainer.offset               = data.offset
  trackContainer.parentIndex          = data.parentIndex
  trackContainer.parentTitle          = data.parentTitle
  trackContainer.parentYear           = data.parentYear
  trackContainer.thumb                = data.thumb
  trackContainer.title1               = data.title1
  trackContainer.title2               = data.title2
  trackContainer.viewGroup            = data.viewGroup
  trackContainer.viewMode             = data.viewMode

  trackContainer.items = data.Metadata.map(parseTrack)

  return trackContainer
}
