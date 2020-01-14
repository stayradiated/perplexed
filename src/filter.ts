export const SECONDS = 's'
export const MINUTES = 'm'
export const HOURS = 'h'
export const DAYS = 'd'
export const WEEKS = 'w'
export const MONTHS = 'mon'
export const YEARS = 'y'

type Value = number | string | string[]

export const serialize = (value: Value): string => {
  if (Array.isArray(value)) {
    return value.join(',')
  }
  if (typeof value === 'number') {
    return value.toString()
  }
  return value
}

export class Filter {
  public title: string

  constructor (title: string) {
    this.title = title
  }

  options () {
    return {}
  }

  filter (symbol: string, value: Value) {
    return { [`${this.title}${symbol}`]: serialize(value) }
  }
}

export class FilterReference extends Filter {
  options () {
    return {
      ...super.options(),
      is: 'is',
      isNot: 'is not',
    }
  }

  is (value: number) {
    return this.filter('', value)
  }

  isNot (value: number) {
    return this.filter('!', value)
  }
}

export class FilterValue extends Filter {
  options () {
    return {
      ...super.options(),
      is: 'is',
      isNot: 'is not',
    }
  }

  is (value: number | string) {
    return this.filter('=', value)
  }

  isNot (value: number | string) {
    return this.filter('!=', value)
  }
}

export class FilterString extends FilterValue {
  options () {
    return {
      ...super.options(),
      contains: 'contains',
      doesNotContain: 'does not contain',
      beginsWith: 'begins with',
      endsWith: 'ends with',
    }
  }

  contains (value: string) {
    return this.filter('', value)
  }

  doesNotContain (value: string) {
    return this.filter('!', value)
  }

  beginsWith (value: Value) {
    return this.filter('<', value)
  }

  endsWith (value: string) {
    return this.filter('>', value)
  }
}

export class FilterNumber extends FilterValue {
  options () {
    return {
      ...super.options(),
      isGreaterThan: 'is greater than',
      isLessThan: 'is less than',
    }
  }

  isGreaterThan (value: number) {
    return this.filter('>>', value)
  }

  isLessThan (value: number) {
    return this.filter('<<', value)
  }
}

export class FilterDate extends Filter {
  options () {
    return {
      ...super.options(),
      isBefore: 'is before',
      isAfter: 'is after',
      inTheLast: 'in the last',
      inNotTheLast: 'in not the last',
    }
  }

  isBefore (value: number) {
    return this.filter('<<', value)
  }

  isAfter (value: number) {
    return this.filter('>>', value)
  }

  inTheLast (value: number, unit: string) {
    return this.filter('>>', `-${value}${unit}`)
  }

  inNotTheLast (value: number, unit: string) {
    return this.filter('<<', `-${value}${unit}`)
  }
}

export const artistTitle = new FilterString('artist.title')
export const artistRating = new FilterNumber('artist.userRating')
export const artistGenre = new FilterReference('artist.genre')
export const artistCollection = new FilterValue('artist.collection')
export const artistCountry = new FilterReference('artist.country')
export const dateArtistAdded = new FilterDate('artist.addedAt')

export const albumTitle = new FilterString('album.title')
export const year = new FilterNumber('album.year')
export const albumGenre = new FilterReference('album.genre')
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

export const availableTrackOptions = {
  artistTitle: 'Artist Title',
  artistRating: 'Artist Rating',
  artistGenre: 'Artist Genre',
  artistCollection: 'Artist Collection',
  artistCountry: 'Artist Country',
  dateArtistAdded: 'Date Artist Added',

  albumTitle: 'Album Title',
  year: 'Year',
  albumGenre: 'Album Genre',
  albumPlays: 'Album Plays',
  albumLastPlayed: 'Album Last Played',
  albumRating: 'Album Rating',
  albumDecade: 'Album Decade',
  albumCollection: 'Album Collection',
  dateAlbumAdded: 'Date Album Added',

  trackTitle: 'Track Title',
  trackPlays: 'Track Plays',
  trackLastPlayed: 'Track Last Played',
  trackSkips: 'Track Skips',
  trackLastSkipped: 'Track Last Skipped',
  trackRating: 'Track Rating',
}

export const availableDateUnits = {
  [SECONDS]: 'Seconds',
  [MINUTES]: 'Minutes',
  [HOURS]: 'Hours',
  [DAYS]: 'Days',
  [WEEKS]: 'Weeks',
  [MONTHS]: 'Months',
  [YEARS]: 'Years',
}

export const limit = (value: number) => {
  return { limit: value.toString() }
}
