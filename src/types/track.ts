import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { MediaContainer, toMediaContainer } from './media-container'
import { Media, toMedia } from './media'
import { toNumber, toDateFromSeconds } from './types'

/**
 * @ignore
 */
const trackSchema = new schema.Entity('tracks')

/**
 * @ignore
 */
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

  addedAt: Date,
  duration: number,
  grandparentKey: string,
  grandparentRatingKey: string,
  grandparentThumb: string,
  grandparentTitle: string,
  grandparentGuid: string,
  guid: string,
  index: number,
  key: string,
  lastViewedAt: Date,
  lastRatedAt: Date,
  originalTitle: string,
  parentGuid: string,
  parentIndex: number,
  parentKey: string,
  parentRatingKey: string,
  parentThumb: string,
  parentTitle: string,
  ratingCount: number,
  ratingKey: string,
  summary: string,
  thumb: string,
  title: string,
  titleSort: string,
  type: string,
  updatedAt: Date,
  userRating: number,
  viewCount: number,
}

/**
 * @ignore
 */
const toTrack = ($data: Prism<any>): Track => {
  return {
    _type: 'track',

    id: $data.get<string>('ratingKey').transform(toNumber).value,
    parentId: $data.get<string>('parentRatingKey').transform(toNumber).value,
    grandparentId: $data.get<string>('grandparentRatingKey').transform(toNumber)
      .value,

    media: $data
      .get('Media')
      .toArray()
      .map(toMedia),

    plexMix: $data
      .get('Related', { quiet: true })
      .get('Directory', { quiet: true }).value,

    addedAt: $data.get<number>('addedAt').transform(toDateFromSeconds).value,
    duration: $data.get<number>('duration').value,
    grandparentKey: $data.get<string>('grandparentKey').value,
    grandparentRatingKey: $data.get<string>('grandparentRatingKey').value,
    grandparentThumb: $data.get<string>('grandparentThumb', { quiet: true })
      .value,
    grandparentTitle: $data.get<string>('grandparentTitle').value,
    grandparentGuid: $data.get<string>('grandparentGuid', { quiet: true })
      .value,
    guid: $data.get<string>('guid', { quiet: true }).value,
    index: $data.get<number>('index').value,
    key: $data.get<string>('key').value,
    lastRatedAt: $data
      .get<number>('lastRatedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    lastViewedAt: $data
      .get<number>('lastViewedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    originalTitle: $data.get<string>('originalTitle', { quiet: true }).value,
    parentGuid: $data.get<string>('parentGuid', { quiet: true }).value,
    parentIndex: $data.get<number>('parentIndex', { quiet: true }).value,
    parentKey: $data.get<string>('parentKey').value,
    parentRatingKey: $data.get<string>('parentRatingKey').value,
    parentThumb: $data.get<string>('parentThumb', { quiet: true }).value,
    parentTitle: $data.get<string>('parentTitle').value,
    ratingCount: $data.get<number>('ratingCount', { quiet: true }).value,
    ratingKey: $data.get<string>('ratingKey').value,
    summary: $data.get<string>('summary', { quiet: true }).value,
    thumb: $data.get<string>('thumb', { quiet: true }).value,
    title: $data.get<string>('title').value,
    titleSort: $data.get<string>('titleSort', { quiet: true }).value,
    type: $data.get<string>('type').value,
    updatedAt: $data.get<number>('updatedAt').transform(toDateFromSeconds)
      .value,
    userRating: $data.get<number>('userRating', { quiet: true }).value,
    viewCount: $data.get<number>('viewCount', { quiet: true }).value,
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

/**
 * @ignore
 */
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

/**
 * @ignore
 */
const parseTrackContainer = createParser('trackContainer', toTrackContainer)

export {
  trackSchema,
  trackContainerSchema,
  toTrack,
  toTrackContainer,
  parseTrackContainer,
}
