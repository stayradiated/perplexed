import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { Track, toTrack, trackSchema } from './track'
import { MediaContainer, toMediaContainer } from './media-container'
import { toDateFromSeconds, toNumber } from './types'

/**
 * @ignore
 */
const playlistItemSchema = new schema.Object({
  track: trackSchema,
})

/**
 * @ignore
 */
const playlistSchema = new schema.Entity('playlists', {
  items: new schema.Array(playlistItemSchema),
})

/**
 * @ignore
 */
const playlistContainerSchema = new schema.Object({
  playlists: new schema.Array(playlistSchema),
})

export interface PlaylistItem {
  _type: string,
  id: number,
  playlistId: number,
  librarySectionID: number,
  librarySectionKey: string,
  librarySectionTitle: string,
  track: Track,
}

export interface NormalizedPlaylistItem extends Omit<PlaylistItem, 'track'> {
  track: number,
}

/**
 * @ignore
 */
const toPlaylistItem = (playlistId: number) => (
  $data: Prism<any>,
): PlaylistItem => {
  return {
    _type: 'playlistItem',
    // items in a smart playlist do not have a playlistItemID
    id: $data.get<number>('playlistItemID', { quiet: true }).value,
    librarySectionID: $data.get<number>('librarySectionID').value,
    librarySectionKey: $data.get<string>('librarySectionKey').value,
    librarySectionTitle: $data.get<string>('librarySectionTitle').value,
    playlistId,
    track: $data.transform(toTrack).value,
  }
}

export interface Playlist extends MediaContainer {
  _type: string,

  id: number,

  addedAt: Date,
  composite: string,
  duration: number,
  guid: string,
  key: string,
  lastViewedAt: Date,
  leafCount: number,
  playlistType: string,
  ratingKey: string,
  smart: boolean,
  summary: string,
  title: string,
  type: string,
  updatedAt: Date,
  viewCount: number,
  titleSort: string,

  items: PlaylistItem[],
}

export interface NormalizedPlaylist extends Omit<Playlist, 'items'> {
  items: NormalizedPlaylistItem[],
}

/**
 * @ignore
 */
const toPlaylist = ($data: Prism<any>): Playlist => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  const playlistId = $data.get('ratingKey').transform(toNumber).value

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'playlist',

    id: $data.get('ratingKey').transform(toNumber).value,

    addedAt: $data
      .get<number>('addedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    composite: $data.get<string>('composite').value,
    duration: $data.get<number>('duration').value,
    guid: $data.get<string>('guid', { quiet: true }).value,
    key: $data.get<string>('key', { quiet: true }).value,
    lastViewedAt: $data
      .get<number>('lastViewedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    leafCount: $data.get<number>('leafCount').value,
    playlistType: $data.get<string>('playlistType').value,
    ratingKey: $data.get<string>('ratingKey').value,
    smart: $data.get<boolean>('smart').value,
    summary: $data.get('summary', { quiet: true }).value,
    title: $data.get<string>('title').value,
    titleSort: $data.get<string>('titleSort', { quiet: true }).value,
    type: $data.get<string>('type', { quiet: true }).value,
    updatedAt: $data
      .get<number>('updatedAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    viewCount: $data.get<number>('viewCount', { quiet: true }).value,

    items: $data
      .get('Metadata', { quiet: true })
      .toArray()
      .map(toPlaylistItem(playlistId)),
  }
}

export interface PlaylistContainer extends MediaContainer {
  _type: string,
  playlists: Playlist[],
}

export interface NormalizedPlaylistContainer
  extends Omit<PlaylistContainer, 'playlists'> {
  playlists: NormalizedPlaylist[],
}

/**
 * @ignore
 */
const toPlaylistContainer = ($data: Prism<any>): PlaylistContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'playlistContainer',

    playlists: $data
      .get('Metadata')
      .toArray()
      .map(toPlaylist),
  }
}

/**
 * @ignore
 */
const parsePlaylist = createParser('playlist', toPlaylist)

/**
 * @ignore
 */
const parsePlaylistContainer = createParser(
  'playlistContainer',
  toPlaylistContainer,
)

export {
  playlistItemSchema,
  playlistSchema,
  playlistContainerSchema,
  toPlaylist,
  toPlaylistContainer,
  parsePlaylist,
  parsePlaylistContainer,
}
