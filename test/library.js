import test from 'ava'

import nock from 'nock'

import Library, {ARTIST} from '../lib/library'
import ServerConnection from '../lib/serverConnection'

const URI = 'http://192.168.1.100:32400'
const PARENT_HEADERS = {
  'X-Plex-Header': true,
}
const PARENT = {
  headers: () => PARENT_HEADERS,
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
    t.deepEqual(res, {value: true})
  })
})

test('sections', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/library/sections')
    .reply(200, require('./fixtures/library/sections.json'))

  return library.sections().then((res) => {
    scope.done()
    t.deepEqual(res,
      require('./fixtures/library/sections.parsed.json'))
  })
})

test('section', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/library/sections/1')
    .reply(200, require('./fixtures/library/section.json'))

  return library.section(1).then((res) => {
    scope.done()
    t.deepEqual(res,
      require('./fixtures/library/section.parsed.json'))
  })
})

test('sectionItems', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: ARTIST,
      sort: 'addedAt:desc',
    })
    .reply(200, require('./fixtures/library/sectionItems.json'))

  return library.sectionItems(1, ARTIST).then((res) => {
    scope.done()
    t.deepEqual(res,
      require('./fixtures/library/sectionItems.parsed.json'))
  })
})

test('metadata', (t) => {
  const {library} = t.context

  const scope = nock(URI)
    .get('/library/metadata/123')
    .query({
      type: ARTIST,
      sort: 'addedAt:desc',
    })
    .reply(200, require('./fixtures/library/metadata.json'))

  return library.metadata(123, ARTIST).then((res) => {
    scope.done()
    t.deepEqual(res,
      require('./fixtures/library/metadata.parsed.json'))
  })
})
