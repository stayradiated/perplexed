import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { MediaContainer, toMediaContainer } from './mediaContainer'
import { Tag, toTagList } from './tags'
import { Track, trackSchema, toTrack } from './track'
import { toNumber, toDateFromSeconds } from './types'

/**
 * @ignore
 */
const artistSchema = new schema.Entity('artists', {
  popularTracks: new schema.Array(trackSchema),
})

/**
 * @ignore
 */
const artistContainerSchema = new schema.Object({
  artists: new schema.Array(artistSchema),
})

/**
 * @ignore
 */
const toPopularTracks = ($data: Prism<any>) => {
  if ($data.has('PopularLeaves')) {
    return $data
      .get('PopularLeaves')
      .get('Metadata')
      .toArray()
      .map(toTrack)
  }
  return []
}

export interface Artist {
  _type: string,
  id: number,

  genre: Tag[],
  country: Tag[],
  popularTracks: Track[],

  addedAt: Date,
  art: string,
  deletedAt: Date,
  guid: string,
  index: number,
  key: string,
  lastViewedAt: Date,
  ratingKey: string,
  summary: string,
  thumb: string,
  title: string,
  titleSort: string,
  type: string,
  updatedAt: Date,
  viewCount: number,
}

/**
 * @ignore
 */
const toArtist = ($data: Prism<any>): Artist => {
  return {
    _type: 'artist',
    id: $data.get('ratingKey').transform(toNumber).value,

    genre: $data.get('Genre', { quiet: true }).transform(toTagList).value,
    country: $data.get('Country', { quiet: true }).transform(toTagList).value,
    popularTracks: $data.transform(toPopularTracks).value,

    addedAt: $data.get<number>('addedAt').transform(toDateFromSeconds).value,
    deletedAt: $data
      .get<number>('deletedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    art: $data.get<string>('art', { quiet: true }).value,
    guid: $data.get<string>('guid', { quiet: true }).value,
    index: $data.get<number>('index').value,
    key: $data.get<string>('key').value,
    lastViewedAt: $data
      .get<number>('lastViewedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    ratingKey: $data.get<string>('ratingKey').value,
    summary: $data.get<string>('summary', { quiet: true }).value,
    thumb: $data.get<string>('thumb', { quiet: true }).value,
    title: $data.get<string>('title').value,
    titleSort: $data.get<string>('titleSort', { quiet: true }).value,
    type: $data.get<string>('type').value,
    updatedAt: $data.get<number>('updatedAt').transform(toDateFromSeconds)
      .value,
    viewCount: $data.get<number>('viewCount', { quiet: true }).value,
  }
}

export interface ArtistContainer extends MediaContainer {
  _type: string,

  artists: Artist[],

  allowSync: boolean,
  art: string,
  librarySectionID: string,
  librarySectionTitle: string,
  librarySectionUUID: string,
  nocache: string,
  thumb: string,
  title1: string,
  title2: string,
  viewGroup: string,
  viewMode: string,
}

/**
 * @ignore
 */
const toArtistContainer = ($data: Prism<any>): ArtistContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'artistContainer',

    artists: $data
      .get('Metadata')
      .toArray()
      .map(toArtist),

    allowSync: $data.get('allowSync').value,
    art: $data.get('art', { quiet: true }).value,
    librarySectionID: $data.get('librarySectionID').value,
    librarySectionTitle: $data.get('librarySectionTitle').value,
    librarySectionUUID: $data.get('librarySectionUUID').value,
    nocache: $data.get('nocache', { quiet: true }).value,
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
const parseArtistContainer = createParser('artistContainer', toArtistContainer)

export {
  artistSchema,
  artistContainerSchema,
  toArtist,
  toArtistContainer,
  parseArtistContainer,
}
