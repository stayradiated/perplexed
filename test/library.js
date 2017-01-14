import assert from 'assert'
import fs from 'fs'
import test from 'ava'
import {join} from 'path'

import nock from 'nock'

import Library, {ARTIST, ALBUM, TRACK} from '../lib/library'
import normalizeResponse from '../lib/normalize'
import ServerConnection from '../lib/serverConnection'

const URI = 'http://192.168.1.100:32400'
const PARENT_HEADERS = {
  'X-Plex-Header': true,
}
const PARENT = {
  headers: () => PARENT_HEADERS,
}

function fixtures (name) {
  const path = join(__dirname, '/fixtures/library', name)
  return {
    response: () => JSON.parse(fs.readFileSync(`${path}.json`)),
    parsed: () => JSON.parse(fs.readFileSync(`${path}.parsed.json`)),
    normalized: () => JSON.parse(fs.readFileSync(`${path}.normalized.json`)),
    saveResponse: (res) => {
      fs.writeFileSync(`${path}.json`, JSON.stringify(res, null, 2))
    },
    saveParsed: (res) => {
      fs.writeFileSync(`${path}.parsed.json`, JSON.stringify(res, null, 2))
    },
    saveNormalized: (res) => {
      fs.writeFileSync(`${path}.normalized.json`, JSON.stringify(res, null, 2))
    },
  }
}

function deepEqual (actual, expected) {
  try {
    assert.deepEqual(actual, expected)
  } catch (err) {
    const difflet = require('difflet')
    const s = difflet.compare(actual, expected)
    process.stdout.write(s)
    throw new Error('deepEqual failed')
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

test('fetchJSON', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/path')
    .query({
      key: 'value',
      'X-Plex-Container-Start': 5,
      'X-Plex-Container-Size': 10,
    })
    .reply(200, {value: true})

  return library.fetchJSON('/path', {
    params: {
      key: 'value',
      start: 5,
      size: 10,
    },
  }).then((res) => {
    scope.done()
    deepEqual(res, {value: true})
  })
})

test('sections', (t) => {
  const {library} = t.context
  const {response, parsed} = fixtures('sections')

  const scope = nock(URI)
    .get('/library/sections')
    .reply(200, response())

  return library.sections().then((res) => {
    scope.done()
    deepEqual(res, parsed())
  })
})

test('section', (t) => {
  const {library} = t.context
  const {response, parsed} = fixtures('section')

  const scope = nock(URI)
    .get('/library/sections/1')
    .reply(200, response())

  return library.section(1).then((res) => {
    scope.done()
    deepEqual(res, parsed())
  })
})

test('sectionItems', (t) => {
  const {library} = t.context
  const {response, parsed} = fixtures('sectionItems')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: ARTIST,
      sort: 'addedAt:desc',
    })
    .reply(200, response())

  return library.sectionItems(1, ARTIST).then((res) => {
    scope.done()
    deepEqual(res, parsed())
  })
})

test('metadata', (t) => {
  const {library} = t.context
  const {response, parsed} = fixtures('metadata')

  const scope = nock(URI)
    .get('/library/metadata/40812')
    .query({
      type: ARTIST,
      sort: 'addedAt:desc',
    })
    .reply(200, response())

  return library.metadata(40812, ALBUM).then((res) => {
    scope.done()
    deepEqual(res, parsed())
  })
})

test('metadataChildren', (t) => {
  const {library} = t.context
  const {response, parsed} = fixtures('metadataChildren')

  const scope = nock(URI)
    .get('/library/metadata/41409/children')
    .reply(200, response())

  return library.metadataChildren(41409, TRACK).then((res) => {
    scope.done()
    deepEqual(res, parsed())
  })
})

test('albums', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('albums')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 9,
      sort: 'addedAt:desc',
    })
    .reply(200, response())

  return library.albums(1).then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})

test('album', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('album')

  const scope = nock(URI)
    .get('/library/metadata/40812')
    .reply(200, response())

  return library.album(40812).then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})

test('albumTracks', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('albumTracks')

  const scope = nock(URI)
    .get('/library/metadata/40812/children')
    .reply(200, response())

  return library.albumTracks(40812).then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})

test('playlists', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('playlists')

  const scope = nock(URI)
    .get('/playlists/all')
    .query({
      type: 15,
      sort: 'titleSort:asc',
    })
    .reply(200, response())

  return library.playlists().then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})

test('playQueue', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('playQueue')

  const scope = nock(URI)
    .get('/playQueues/3147')
    .reply(200, response())

  return library.playQueue(3147).then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})

test('searchAll', (t) => {
  const {library} = t.context
  const {response, parsed, normalized} = fixtures('searchAll')

  const scope = nock(URI)
    .get('/hubs/search')
    .query({
      query: 'ride',
      limit: 10,
    })
    .reply(200, response())

  return library.searchAll('ride', 10).then((res) => {
    scope.done()
    deepEqual(res, parsed())
    return normalizeResponse(res)
  }).then((nres) => deepEqual(normalized(), nres))
})
