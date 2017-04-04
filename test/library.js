import fs from 'fs'
import test from 'ava'
import {join} from 'path'

import nock from 'nock'

import Library, {ARTIST, ALBUM, TRACK} from '../lib/library'
import normalize from '../lib/normalize'
import ServerConnection from '../lib/serverConnection'

const URI = 'http://192.168.0.100:32400'
const PARENT_HEADERS = {
  'X-Plex-Header': true,
}
const PARENT = {
  headers: () => PARENT_HEADERS,
}

function fixture (name) {
  const path = join(__dirname, '/fixtures/library', name)
  return JSON.parse(fs.readFileSync(`${path}.json`))
}

function snapshot (t, scope) {
  return (res) => {
    scope.done()
    t.snapshot(res)
    return normalize(res).then((nres) => {
      t.snapshot(nres)
    })
  }
}

test.beforeEach((t) => {
  t.context.sc = new ServerConnection(URI, PARENT)
  t.context.library = new Library(t.context.sc)
})

test('constructor', (t) => {
  const {sc, library} = t.context
  t.is(sc, library.api)
})

test('fetch', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/path')
    .query({
      key: 'value',
      'X-Plex-Container-Start': 5,
      'X-Plex-Container-Size': 10,
    })
    .reply(200, {value: true})

  return library.fetch('/path', {
    params: {
      key: 'value',
      start: 5,
      size: 10,
    },
  }).then((res) => {
    scope.done()
    t.deepEqual(res, {value: true})
  })
})

test('sections', (t) => {
  const {library} = t.context
  const response = fixture('sections')

  const scope = nock(URI)
    .get('/library/sections')
    .reply(200, response)

  return library.sections().then(snapshot(t, scope))
})

test('section', (t) => {
  const {library} = t.context
  const response = fixture('section')

  const scope = nock(URI)
    .get('/library/sections/1')
    .reply(200, response)

  return library.section(1).then(snapshot(t, scope))
})

test('sectionItems', (t) => {
  const {library} = t.context
  const response = fixture('sectionItems')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: ARTIST,
      sort: 'addedAt:desc',
    })
    .reply(200, response)

  return library.sectionItems(1, ARTIST).then(snapshot(t, scope))
})

test('metadata', (t) => {
  const {library} = t.context
  const response = fixture('metadata')

  const scope = nock(URI)
    .get('/library/metadata/74892')
    .reply(200, response)

  return library.metadata(74892, ALBUM).then(snapshot(t, scope))
})

test('metadataChildren', (t) => {
  const {library} = t.context
  const response = fixture('metadataChildren')

  const scope = nock(URI)
    .get('/library/metadata/41409/children')
    .reply(200, response)

  return library.metadataChildren(41409, TRACK).then(snapshot(t, scope))
})

test('tracks', (t) => {
  const {library} = t.context
  const response = fixture('tracks')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 10,
      sort: 'addedAt:desc',
    })
    .reply(200, response)

  return library.tracks(1).then(snapshot(t, scope))
})

test('track', (t) => {
  const {library} = t.context
  const response = fixture('track')

  const scope = nock(URI)
    .get('/library/metadata/35341')
    .reply(200, response)

  return library.track(35341).then(snapshot(t, scope))
})

test('albums', (t) => {
  const {library} = t.context
  const response = fixture('albums')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 9,
      sort: 'addedAt:desc',
    })
    .reply(200, response)

  return library.albums(1).then(snapshot(t, scope))
})

test('album', (t) => {
  const {library} = t.context
  const response = fixture('album')

  const scope = nock(URI)
    .get('/library/metadata/40812')
    .reply(200, response)

  return library.album(40812).then(snapshot(t, scope))
})

test('albumTracks', (t) => {
  const {library} = t.context
  const response = fixture('albumTracks')

  const scope = nock(URI)
    .get('/library/metadata/40812/children')
    .reply(200, response)

  return library.albumTracks(40812).then(snapshot(t, scope))
})

test('playlists', (t) => {
  const {library} = t.context
  const response = fixture('playlists')

  const scope = nock(URI)
    .get('/playlists/all')
    .query({
      type: 15,
      sort: 'titleSort:asc',
    })
    .reply(200, response)

  return library.playlists().then(snapshot(t, scope))
})

test('playlist', (t) => {
  const {library} = t.context
  const response = fixture('playlist')

  const scope = nock(URI)
    .get('/playlists/45606')
    .reply(200, response)

  return library.playlist(45606).then(snapshot(t, scope))
})

test('playlistTracks', (t) => {
  const {library} = t.context
  const response = fixture('playlistTracks')

  const scope = nock(URI)
    .get('/playlists/123/items')
    .reply(200, response)

  return library.playlistTracks(123).then(snapshot(t, scope))
})

test('playQueue', (t) => {
  const {library} = t.context
  const response = fixture('playQueue')

  const scope = nock(URI)
    .get('/playQueues/3147')
    .reply(200, response)

  return library.playQueue(3147).then(snapshot(t, scope))
})

test('shufflePlayQueue', (t) => {
  const {library} = t.context
  const response = fixture('playQueue')

  const scope = nock(URI)
    .put('/playQueues/3921/shuffle')
    .reply(200, response)

  return library.shufflePlayQueue(3921).then(snapshot(t, scope))
})

test('unshufflePlayQueue', (t) => {
  const {library} = t.context
  const response = fixture('playQueue')

  const scope = nock(URI)
    .put('/playQueues/3921/unshuffle')
    .reply(200, response)

  return library.unshufflePlayQueue(3921).then(snapshot(t, scope))
})

test('searchAll', (t) => {
  const {library} = t.context
  const response = fixture('searchAll')

  const scope = nock(URI)
    .get('/hubs/search')
    .query({
      query: 'ride',
      limit: 10,
    })
    .reply(200, response)

  return library.searchAll('ride', 10).then(snapshot(t, scope))
})

test('resizePhoto', (t) => {
  const {library} = t.context

  const image = 'https://images.unsplash.com/photo-1429728001698-8ba1c4c64783'
  const encodedImage = encodeURIComponent(image)

  const url = library.resizePhoto({
    uri: image,
    width: 200,
    height: 200,
  })

  t.is(url, `${URI}/photo/:/transcode?uri=${encodedImage}&width=200&height=200`)
})
