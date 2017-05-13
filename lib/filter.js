export const SECONDS = 's'
export const MINUTES = 'm'
export const HOURS = 'h'
export const DAYS = 'd'
export const WEEKS = 'w'
export const MONTHS = 'mon'
export const YEARS = 'y'

export const serialize = (value) => {
  if (Array.isArray(value)) {
    return value.join(',')
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  return value
}


export class Filter {
  constructor (title) {
    this.title = title
  }

  filter (symbol, value) {
    return {[`${this.title}${symbol}`]: serialize(value)}
  }
}

export class FilterValue extends Filter {
  is (value) {
    console.assert(typeof value === 'string' || typeof value === 'number', 'is value must be a string or a number')
    return this.filter('=', value)
  }

  isNot (value) {
    console.assert(typeof value === 'string' || typeof value === 'number', 'isNot value must be a string or a number')
    return this.filter('!=', value)
  }
}

export class FilterString extends FilterValue {
  contains (value) {
    console.assert(typeof value === 'string', 'contains value must be a string')
    return this.filter('', value)
  }

  doesNotContain (value) {
    console.assert(typeof value === 'string', 'doesNotContain value must be a string')
    return this.filter('!', value)
  }

  beginsWith (value) {
    console.assert(typeof value === 'string', 'beginsWith value must be a string')
    return this.filter('<', value)
  }

  endsWith (value) {
    console.assert(typeof value === 'string', 'endsWith value must be a string')
    return this.filter('>', value)
  }
}

export class FilterNumber extends FilterValue {
  isGreaterThan (value) {
    console.assert(typeof value === 'number', 'isGreaterThan value must be a number')
    return this.filter('>>', value)
  }

  isLessThan (value) {
    console.assert(typeof value === 'number', 'isLessThan value must be a number')
    return this.filter('<<', value)
  }
}

export class FilterDate extends Filter {
  isBefore (value) {
    console.assert(typeof value === 'number', 'isBefore value must be a number')
    return this.filter('<<', value)
  }

  isAfter (value) {
    console.assert(typeof value === 'number', 'isAfter value must be a number')
    return this.filter('>>', value)
  }

  inTheLast (value, unit) {
    console.assert(typeof value === 'number', 'inTheLast value must be a number')
    console.assert(typeof unit === 'string', 'inTheLast unit must be a string')
    return this.filter('>>', `-${value}${unit}`)
  }

  inNotTheLast (value, unit) {
    console.assert(typeof value === 'number', 'inNotTheLast value must be a number')
    console.assert(typeof unit === 'string', 'inNotTheLast unit must be a string')
    return this.filter('<<', `-${value}${unit}`)
  }
}

export const artistTitle = new FilterString('artist.title')
export const artistRating = new FilterNumber('artist.userRating')
export const artistGenre = new FilterValue('artist.genre')
export const artistCollection = new FilterValue('artist.collection')
export const artistCountry = new FilterValue('artist.country')
export const dateArtistAdded = new FilterDate('artist.addedAt')

export const albumTitle = new FilterString('album.title')
export const year = new FilterNumber('album.year')
export const albumGenre = new FilterValue('album.genre')
export const albumPlays = new FilterNumber('album.viewCount')
export const albumLastPlayed = new FilterDate('album.lastViewdAt')
export const albumRating = new FilterNumber('album.userRating')
export const albumDecade = new FilterNumber('album.decade')
export const albumCollection = new FilterValue('album.collection')
export const dateAlbumAdded = new FilterDate('album.addedAt')

export const trackTitle = new FilterString('track.title')
export const trackPlays = new FilterNumber('track.viewCount')
export const trackLastPlayed = new FilterDate('track.viewCount')
export const trackSkips = new FilterNumber('track.skipCount')
export const trackLastSkipped = new FilterDate('track.lastSkippedAt')
export const trackRating = new FilterNumber('track.userRating')

export const limit = (limit) => {
  console.assert(typeof limit === 'number', 'limit must be a number')
  return {limit: limit.toString()}
}
