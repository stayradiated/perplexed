/* @external */

import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { MediaContainer, toMediaContainer } from './mediaContainer'
import { Tag, toTagList } from './tags'
import { toNumber, toTimestamp, toDate } from './types'

const albumSchema = new schema.Entity('albums')
const albumContainerSchema = new schema.Object({
  albums: new schema.Array(albumSchema),
})

export interface Album {
  _type: string,

  id: number,
  parentId: number,

  genre: Tag[],
  mood: Tag[],
  style: Tag[],
  director: Tag[],

  addedAt: Date,
  art: string,
  deletedAt: Date,
  guid: string,
  index: number,
  key: string,
  lastRatedAt: Date,
  lastViewedAt: Date,
  leafCount: number,
  librarySectionID: string,
  librarySectionKey: string,
  librarySectionTitle: string,
  loudnessAnalysisVersion: string,
  originallyAvailableAt: Date,
  parentGuid: string,
  parentKey: string,
  parentRatingKey: string,
  parentThumb: string,
  parentTitle: string,
  ratingKey: string,
  studio: string,
  summary: string,
  thumb: string,
  title: string,
  type: string,
  updatedAt: Date,
  userRating: number,
  viewCount: number,
  viewedLeafCount: number,
  year: number,
}

const toAlbum = ($data: Prism<any>): Album => {
  return {
    _type: 'album',
    id: $data.get<string>('ratingKey').transform(toNumber).value,
    parentId: $data.get<string>('parentRatingKey').transform(toNumber).value,

    genre: $data.get('Genre', { quiet: true }).transform(toTagList).value,
    director: $data.get('Director', { quiet: true }).transform(toTagList).value,
    style: $data.get('Style', { quiet: true }).transform(toTagList).value,
    mood: $data.get('Mood', { quiet: true }).transform(toTagList).value,

    addedAt: $data
      .get<number>('addedAt')
      .transform(toTimestamp)
      .transform(toDate).value,
    art: $data.get<string>('art', { quiet: true }).value,
    deletedAt: $data
      .get<number>('deletedAt', { quiet: true })
      .transform(toTimestamp)
      .transform(toDate).value,
    guid: $data.get<string>('guid').value,
    index: $data.get<number>('index').value,
    key: $data.get<string>('key').value,
    lastRatedAt: $data
      .get<number>('lastRatedAt', { quiet: true })
      .transform(toTimestamp)
      .transform(toDate).value,
    lastViewedAt: $data
      .get<number>('lastViewedAt', { quiet: true })
      .transform(toTimestamp)
      .transform(toDate).value,
    leafCount: $data.get<number>('leafCount', { quiet: true }).value,
    librarySectionID: $data.get<string>('librarySectionID', { quiet: true })
      .value,
    librarySectionKey: $data.get<string>('librarySectionKey', { quiet: true })
      .value,
    librarySectionTitle: $data.get<string>('librarySectionTitle', {
      quiet: true,
    }).value,
    loudnessAnalysisVersion: $data.get<string>('loudnessAnalysisVersion', {
      quiet: true,
    }).value,
    originallyAvailableAt: $data
      .get<string>('originallyAvailableAt', { quiet: true })
      .transform(toDate).value,
    parentGuid: $data.get<string>('parentGuid', { quiet: true }).value,
    parentKey: $data.get<string>('parentKey').value,
    parentRatingKey: $data.get<string>('parentRatingKey').value,
    parentThumb: $data.get<string>('parentThumb', { quiet: true }).value,
    parentTitle: $data.get<string>('parentTitle').value,
    ratingKey: $data.get<string>('ratingKey').value,
    studio: $data.get<string>('studio', { quiet: true }).value,
    summary: $data.get<string>('summary', { quiet: true }).value,
    thumb: $data.get<string>('thumb', { quiet: true }).value,
    title: $data.get<string>('title').value,
    type: $data.get<string>('type').value,
    updatedAt: $data
      .get<number>('updatedAt', { quiet: true })
      .transform(toTimestamp)
      .transform(toDate).value,
    userRating: $data.get<number>('userRating', { quiet: true }).value,
    viewCount: $data.get<number>('viewCount', { quiet: true }).value,
    viewedLeafCount: $data.get<number>('viewedLeafCount', { quiet: true })
      .value,
    year: $data.get<number>('year', { quiet: true }).value,
  }
}

export interface AlbumContainer extends MediaContainer {
  _type: string,
  albums: Album[],
  allowSync: boolean,
  art: string,
  mixedParents: boolean,
  nocache: boolean,
  thumb: string,
  title1: string,
  title2: string,
  viewGroup: string,
  viewMode: number,
}

const toAlbumContainer = ($data: Prism<any>): AlbumContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'albumContainer',

    albums: $data
      .get('Metadata')
      .toArray()
      .map(toAlbum),

    allowSync: $data.get('allowSync').value,
    art: $data.get('art', { quiet: true }).value,
    mixedParents: $data.get('mixedParents', { quiet: true }).value,
    nocache: $data.get('nocache', { quiet: true }).value,
    thumb: $data.get('thumb', { quiet: true }).value,
    title1: $data.get('title1', { quiet: true }).value,
    title2: $data.get('title2', { quiet: true }).value,
    viewGroup: $data.get('viewGroup', { quiet: true }).value,
    viewMode: $data.get('viewMode', { quiet: true }).value,
  }
}

const parseAlbumContainer = createParser('albumContainer', toAlbumContainer)

export {
  albumSchema,
  albumContainerSchema,
  toAlbum,
  toAlbumContainer,
  parseAlbumContainer,
}
