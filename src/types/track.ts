import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { MediaContainer, toMediaContainer } from './mediaContainer'
import { Media, toMedia } from './media'
import { toNumber } from './types'

const trackSchema = new schema.Entity('tracks')
const trackContainerSchema = new schema.Object({
  tracks: new schema.Array(trackSchema),
})

export interface Track {
  _type: string,
  id: number,
  parentId: number,
  grandparentId: number,
  media: Media[],
  plexMix: unknown,
  addedAt: string,
  duration: string,
  grandparentKey: string,
  grandparentRatingKey: string,
  grandparentThumb: string,
  grandparentTitle: string,
  index: string,
  key: string,
  lastViewedAt: string,
  originalTitle: string,
  parentIndex: string,
  parentKey: string,
  parentRatingKey: string,
  parentThumb: string,
  parentTitle: string,
  ratingCount: string,
  ratingKey: string,
  summary: string,
  thumb: string,
  title: string,
  type: string,
  updatedAt: string,
  userRating: string,
  viewCount: string,
}

const toTrack = ($data: Record<string, any>): Track => {
  return {
    _type: 'track',

    id: $data.get('ratingKey').transform(toNumber).value,
    parentId: $data.get('parentRatingKey').transform(toNumber).value,
    grandparentId: $data.get('grandparentRatingKey').transform(toNumber).value,

    media: $data
      .get('Media')
      .toArray()
      .map(toMedia),

    plexMix: $data
      .get('Related', { quiet: true })
      .get('Directory', { quiet: true }).value,

    addedAt: $data.get('addedAt').value,
    duration: $data.get('duration').value,
    grandparentKey: $data.get('grandparentKey').value,
    grandparentRatingKey: $data.get('grandparentRatingKey').value,
    grandparentThumb: $data.get('grandparentThumb').value,
    grandparentTitle: $data.get('grandparentTitle').value,
    index: $data.get('index').value,
    key: $data.get('key').value,
    lastViewedAt: $data.get('lastViewedAt', { quiet: true }).value,
    originalTitle: $data.get('originalTitle', { quiet: true }).value,
    parentIndex: $data.get('parentIndex').value,
    parentKey: $data.get('parentKey').value,
    parentRatingKey: $data.get('parentRatingKey').value,
    parentThumb: $data.get('parentThumb').value,
    parentTitle: $data.get('parentTitle').value,
    ratingCount: $data.get('ratingCount', { quiet: true }).value,
    ratingKey: $data.get('ratingKey').value,
    summary: $data.get('summary', { quiet: true }).value,
    thumb: $data.get('thumb').value,
    title: $data.get('title').value,
    type: $data.get('type').value,
    updatedAt: $data.get('updatedAt').value,
    userRating: $data.get('userRating', { quiet: true }).value,
    viewCount: $data.get('viewCount', { quiet: true }).value,
  }
}

export interface TrackContainer extends MediaContainer {
  _type: string,
  tracks: Track[],
  allowSync: string,
  art: string,
  grandparentRatingKey: string,
  grandparentThumb: string,
  grandparentTitle: string,
  key: string,
  librarySectionID: string,
  librarySectionTitle: string,
  librarySectionUUID: string,
  nocache: string,
  parentIndex: string,
  parentTitle: string,
  parentYear: string,
  thumb: string,
  title1: string,
  title2: string,
  viewGroup: string,
  viewMode: string,
}

const toTrackContainer = ($data: Prism<any>): TrackContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'trackContainer',

    tracks: $data
      .get('Metadata')
      .toArray()
      .map(toTrack),

    allowSync: $data.get('allowSync').value,
    art: $data.get('art', { quiet: true }).value,
    grandparentRatingKey: $data.get('grandparentRatingKey', { quiet: true })
      .value,
    grandparentThumb: $data.get('grandparentThumb', { quiet: true }).value,
    grandparentTitle: $data.get('grandparentTitle', { quiet: true }).value,
    key: $data.get('key', { quiet: true }).value,
    librarySectionID: $data.get('librarySectionID').value,
    librarySectionTitle: $data.get('librarySectionTitle').value,
    librarySectionUUID: $data.get('librarySectionUUID').value,
    nocache: $data.get('nocache', { quiet: true }).value,
    parentIndex: $data.get('parentIndex', { quiet: true }).value,
    parentTitle: $data.get('parentTitle', { quiet: true }).value,
    parentYear: $data.get('parentYear', { quiet: true }).value,
    thumb: $data.get('thumb', { quiet: true }).value,
    title1: $data.get('title1', { quiet: true }).value,
    title2: $data.get('title2', { quiet: true }).value,
    viewGroup: $data.get('viewGroup', { quiet: true }).value,
    viewMode: $data.get('viewMode', { quiet: true }).value,
  }
}

const parseTrackContainer = createParser('trackContainer', toTrackContainer)

export {
  trackSchema,
  trackContainerSchema,
  toTrack,
  toTrackContainer,
  parseTrackContainer,
}
