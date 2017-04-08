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

// sort methods
export const SORT_ARTISTS_BY_TITLE = 'titleSort'
export const SORT_ARTISTS_BY_DATE_ADDED = 'addedAt'
export const SORT_ARTISTS_BY_DATE_PLAYED = 'lastViewedAt'
export const SORT_ARTISTS_BY_PLAYS = 'viewCount'

export const SORT_ALBUMS_BY_TITLE = 'titleSort'
export const SORT_ALBUMS_BY_TITLE_DESC = 'titleSort:desc'
export const SORT_ALBUMS_BY_ALBUM_ARTIST = 'artist.titleSort,album.year'
export const SORT_ALBUMS_BY_ALBUM_ARTIST_DESC = 'artist.titleSort:desc,album.year'
export const SORT_ALBUMS_BY_YEAR = 'year'
export const SORT_ALBUMS_BY_YEAR_DESC = 'year:desc'
export const SORT_ALBUMS_BY_RELEASE_DATE = 'originallyAvailableAt'
export const SORT_ALBUMS_BY_RELEASE_DATE_DESC = 'originallyAvailableAt:desc'
export const SORT_ALBUMS_BY_RATING = 'userRating'
export const SORT_ALBUMS_BY_RATING_DESC = 'userRating:desc'
export const SORT_ALBUMS_BY_DATE_ADDED = 'addedAt'
export const SORT_ALBUMS_BY_DATE_ADDED_DESC = 'addedAt:desc'
export const SORT_ALBUMS_BY_DATE_PLAYED = 'lastViewedAt'
export const SORT_ALBUMS_BY_DATE_PLAYED_DESC = 'lastViewedAt:desc'
export const SORT_ALBUM_BY_VIEWS = 'viewCount'
export const SORT_ALBUM_BY_VIEWS_DESC = 'viewCount:desc'

export const SORT_TRACKS_BY_TITLE = 'titleSort'
export const SORT_TRACKS_BY_ALBUM_ARTIST = 'artist.titleSort,album.titleSort,track.index'
export const SORT_TRACKS_BY_ARTIST = 'track.originalTitle,album.titleSort,track.index'
export const SORT_TRACKS_BY_ALBUM = 'album.titleSort,track.index'
export const SORT_TRACKS_BY_YEAR = 'year'
export const SORT_TRACKS_BY_RATING = 'userRating'
export const SORT_TRACKS_BY_DURATION = 'duration'
export const SORT_TRACKS_BY_PLAYS = 'viewCount'
export const SORT_TRACKS_BY_DATE_ADDED = 'addedAt'
export const SORT_TRACKS_BY_BITRATE = 'mediaBitrate'

// playlist types
export const PLAYLIST_TYPE_MUSIC = 'audio'
export const PLAYLIST_TYPE_PHOTO = 'photo'
export const PLAYLIST_TYPE_VIDEO = 'video'
