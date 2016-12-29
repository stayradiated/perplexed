import {schema} from 'normalizr'

import parseMediaContainer from './mediaContainer'

export const albumSchema = new schema.Entity('albums')
export const albumContainerSchema = new schema.Object({
  items: new schema.Array(albumSchema),
})

export function parseAlbum (data) {
  const album  = {}

  album.allowSync             = data.allowSync
  album.librarySectionID      = data.librarySectionID
  album.librarySectionTitle   = data.librarySectionTitle
  album.librarySectionUUID    = data.librarySectionUUID
  album.ratingKey             = data.ratingKey
  album.key                   = data.key
  album.parentRatingKey       = data.parentRatingKey
  album.studio                = data.studio
  album.type                  = data.type
  album.title                 = data.title
  album.parentKey             = data.parentKey
  album.parentTitle           = data.parentTitle
  album.summary               = data.summary
  album.index                 = data.index
  album.viewCount             = data.viewCount
  album.lastViewedAt          = data.lastViewedAt
  album.year                  = data.year
  album.thumb                 = data.thumb
  album.parentThumb           = data.parentThumb
  album.originallyAvailableAt = data.originallyAvailableAt
  album.leafCount             = data.leafCount
  album.addedAt               = data.addedAt
  album.updatedAt             = data.updatedAt

  album.id = parseInt(album.ratingKey, 10)

  album.genre = (data.Genre || [])
    .map((genre) => genre.tag)

  return album
}

export function parseAlbumContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const albumContainer = {
    ...parseMediaContainer(data),
  }

  albumContainer.allowSync    = data.allowSync
  albumContainer.art          = data.art
  albumContainer.mixedParents = data.mixedParents
  albumContainer.nocache      = data.nocache
  albumContainer.offset       = data.offset
  albumContainer.thumb        = data.thumb
  albumContainer.title1       = data.title1
  albumContainer.title2       = data.title2
  albumContainer.viewGroup    = data.viewGroup
  albumContainer.viewMode     = data.viewMode

  albumContainer.items = data.Metadata.map(parseAlbum)

  return albumContainer
}
