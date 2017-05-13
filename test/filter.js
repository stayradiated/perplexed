import test from 'ava'

import * as filter from '../lib/filter'

test.beforeEach((t) => {
  t.context.filterValue = new filter.FilterValue('key')
  t.context.filterString = new filter.FilterString('key')
  t.context.filterNumber = new filter.FilterNumber('key')
  t.context.filterDate = new filter.FilterDate('key')
})

test('FilterValue.is', (t) => {
  const {filterValue} = t.context
  const f = filterValue.is('value')
  t.deepEqual(f, {'key=': 'value'})
})

test('FilterValue.isNot', (t) => {
  const {filterValue} = t.context
  const f = filterValue.isNot('value')
  t.deepEqual(f, {'key!=': 'value'})
})

test('FilterString.contains', (t) => {
  const {filterString} = t.context
  const f = filterString.contains('value')
  t.deepEqual(f, {key: 'value'})
})

test('FilterString.doesNotContain', (t) => {
  const {filterString} = t.context
  const f = filterString.doesNotContain('value')
  t.deepEqual(f, {'key!': 'value'})
})

test('FilterString.beginsWith', (t) => {
  const {filterString} = t.context
  const f = filterString.beginsWith('value')
  t.deepEqual(f, {'key<': 'value'})
})

test('FilterString.endsWith', (t) => {
  const {filterString} = t.context
  const f = filterString.endsWith('value')
  t.deepEqual(f, {'key>': 'value'})
})

test('FilterString.is', (t) => {
  const {filterString} = t.context
  const f = filterString.is('value')
  t.deepEqual(f, {'key=': 'value'})
})

test('FilterString.isNot', (t) => {
  const {filterString} = t.context
  const f = filterString.isNot('value')
  t.deepEqual(f, {'key!=': 'value'})
})

test('FilterNumber.isGreaterThan', (t) => {
  const {filterNumber} = t.context
  const f = filterNumber.isGreaterThan(100)
  t.deepEqual(f, {'key>>': '100'})
})

test('filterNumber.isLessThan', (t) => {
  const {filterNumber} = t.context
  const f = filterNumber.isLessThan(100)
  t.deepEqual(f, {'key<<': '100'})
})

test('filterDate.isBefore', (t) => {
  const {filterDate} = t.context
  const f = filterDate.isBefore(100)
  t.deepEqual(f, {'key<<': '100'})
})

test('filterDate.isAfter', (t) => {
  const {filterDate} = t.context
  const f = filterDate.isAfter(100)
  t.deepEqual(f, {'key>>': '100'})
})

test('filterDate.inTheLast', (t) => {
  const {filterDate} = t.context
  const f = filterDate.inTheLast(10, 's')
  t.deepEqual(f, {'key>>': '-10s'})
})

test('filterDate.inNotTheLast', (t) => {
  const {filterDate} = t.context
  const f = filterDate.inNotTheLast(10, 's')
  t.deepEqual(f, {'key<<': '-10s'})
})

test('artistTitle', (t) => {
  const f = filter.artistTitle.is('value')
  t.deepEqual(f, {'artist.title=': 'value'})
})

test('artistRating', (t) => {
  const f = filter.artistRating.is('value')
  t.deepEqual(f, {'artist.userRating=': 'value'})
})

test('artistGenre', (t) => {
  const f = filter.artistGenre.is('value')
  t.deepEqual(f, {'artist.genre=': 'value'})
})

test('artistCollection', (t) => {
  const f = filter.artistCollection.is('value')
  t.deepEqual(f, {'artist.collection=': 'value'})
})

test('artistCountry', (t) => {
  const f = filter.artistCountry.is('value')
  t.deepEqual(f, {'artist.country=': 'value'})
})

test('dateArtistAdded', (t) => {
  const f = filter.dateArtistAdded.isBefore(100)
  t.deepEqual(f, {'artist.addedAt<<': '100'})
})


test('albumTitle', (t) => {
  const f = filter.albumTitle.is('value')
  t.deepEqual(f, {'album.title=': 'value'})
})

test('year', (t) => {
  const f = filter.year.is('value')
  t.deepEqual(f, {'album.year=': 'value'})
})

test('albumGenre', (t) => {
  const f = filter.albumGenre.is('value')
  t.deepEqual(f, {'album.genre=': 'value'})
})

test('albumPlays', (t) => {
  const f = filter.albumPlays.is('value')
  t.deepEqual(f, {'album.viewCount=': 'value'})
})

test('albumLastPlayed', (t) => {
  const f = filter.albumLastPlayed.isBefore(100)
  t.deepEqual(f, {'album.lastViewdAt<<': '100'})
})

test('albumRating', (t) => {
  const f = filter.albumRating.is('value')
  t.deepEqual(f, {'album.userRating=': 'value'})
})

test('albumDecade', (t) => {
  const f = filter.albumDecade.is('value')
  t.deepEqual(f, {'album.decade=': 'value'})
})

test('albumCollection', (t) => {
  const f = filter.albumCollection.is('value')
  t.deepEqual(f, {'album.collection=': 'value'})
})

test('dateAlbumAdded', (t) => {
  const f = filter.dateAlbumAdded.isBefore(100)
  t.deepEqual(f, {'album.addedAt<<': '100'})
})


test('trackTitle', (t) => {
  const f = filter.trackTitle.is('value')
  t.deepEqual(f, {'track.title=': 'value'})
})

test('trackPlays', (t) => {
  const f = filter.trackPlays.is('value')
  t.deepEqual(f, {'track.viewCount=': 'value'})
})

test('trackLastPlayed', (t) => {
  const f = filter.trackLastPlayed.isBefore(100)
  t.deepEqual(f, {'track.viewCount<<': '100'})
})

test('trackSkips', (t) => {
  const f = filter.trackSkips.is('value')
  t.deepEqual(f, {'track.skipCount=': 'value'})
})

test('trackLastSkipped', (t) => {
  const f = filter.trackLastSkipped.isBefore(100)
  t.deepEqual(f, {'track.lastSkippedAt<<': '100'})
})

test('trackRating', (t) => {
  const f = filter.trackRating.is('value')
  t.deepEqual(f, {'track.userRating=': 'value'})
})

test('limit', (t) => {
  const f = filter.limit(100)
  t.deepEqual(f, {limit: '100'})
})
