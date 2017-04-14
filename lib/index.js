export {default as Account} from './account'
export {default as Client} from './client'
export {default as ServerConnection} from './serverConnection'
export {default as normalize, normalizeSync} from './normalize'
export {
  default as Library,
  ARTIST,
  ALBUM,
  TRACK,
  PLAYLIST,
  QUEUE,
} from './library'

const sort = (asc, desc = `${asc}:desc`) => [asc, desc]

// sort methods
export const SORT_ARTISTS_BY_TITLE = sort('titleSort')
export const SORT_ARTISTS_BY_DATE_ADDED = sort('addedAt')
export const SORT_ARTISTS_BY_DATE_PLAYED = sort('lastViewedAt')
export const SORT_ARTISTS_BY_PLAYS = sort('viewCount')

export const SORT_ALBUMS_BY_TITLE = sort('titleSort')
export const SORT_ALBUMS_BY_ALBUM_ARTIST = sort(
  'artist.titleSort,album.year',
  'artist.titleSort:desc,album.year')
export const SORT_ALBUMS_BY_YEAR = sort('year')
export const SORT_ALBUMS_BY_RELEASE_DATE = sort('originallyAvailableAt')
export const SORT_ALBUMS_BY_RATING = sort('userRating')
export const SORT_ALBUMS_BY_DATE_ADDED = sort('addedAt')
export const SORT_ALBUMS_BY_DATE_PLAYED = sort('lastViewedAt')
export const SORT_ALBUM_BY_VIEWS = sort('viewCount')

export const SORT_TRACKS_BY_TITLE = sort('titleSort')
export const SORT_TRACKS_BY_ALBUM_ARTIST = sort('artist.titleSort,album.titleSort,track.index')
export const SORT_TRACKS_BY_ARTIST = sort('track.originalTitle,album.titleSort,track.index')
export const SORT_TRACKS_BY_ALBUM = sort('album.titleSort,track.index')
export const SORT_TRACKS_BY_YEAR = sort('year')
export const SORT_TRACKS_BY_RATING = sort('userRating')
export const SORT_TRACKS_BY_DURATION = sort('duration')
export const SORT_TRACKS_BY_PLAYS = sort('viewCount')
export const SORT_TRACKS_BY_DATE_ADDED = sort('addedAt')
export const SORT_TRACKS_BY_BITRATE = sort('mediaBitrate')

// playlist types
export const PLAYLIST_TYPE_MUSIC = 'audio'
export const PLAYLIST_TYPE_PHOTO = 'photo'
export const PLAYLIST_TYPE_VIDEO = 'video'
