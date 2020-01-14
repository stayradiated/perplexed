import anyTest, { TestInterface } from 'ava'

import nock from 'nock'

import { fixture, snapshot } from './test-helpers'

import Library, { ARTIST, ALBUM, TRACK } from './library'
import ServerConnection from './server-connection'

const URI = 'http://192.168.0.100:32400'
const PARENT_HEADERS = {
  'X-Plex-Token': 'xxxx',
}
const PARENT = {
  headers: () => PARENT_HEADERS,
}

const test = anyTest as TestInterface<{
  sc: ServerConnection,
  library: Library,
}>

test.beforeEach((t) => {
  t.context.sc = new ServerConnection(URI, PARENT)
  t.context.library = new Library(t.context.sc)
})

test('constructor', (t) => {
  const { sc, library } = t.context
  t.is(sc, library.api)
})

test('fetch', async (t) => {
  const { library } = t.context

  const scope = nock(URI)
    .get('/path')
    .query({
      key: 'value',
      'X-Plex-Container-Start': '5',
      'X-Plex-Container-Size': '10',
    })
    .reply(200, { value: true })

  const res = await library.fetch('/path', {
    params: {
      key: 'value',
      start: '5',
      size: '10',
    },
  })

  t.deepEqual(res, { value: true })

  scope.done()
})

test('sections', async (t) => {
  const { library } = t.context
  const response = fixture('library/sections.json')

  const scope = nock(URI)
    .get('/library/sections')
    .reply(200, response)

  await library.sections().then(snapshot(t, scope))
})

test('section', async (t) => {
  const { library } = t.context
  const response = fixture('library/section.json')

  const scope = nock(URI)
    .get('/library/sections/1')
    .reply(200, response)

  await library.section(1).then(snapshot(t, scope))
})

test('sectionItems', async (t) => {
  const { library } = t.context
  const response = fixture('library/sectionItems.json')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: ARTIST,
    })
    .reply(200, response)

  await library.sectionItems(1, ARTIST).then(snapshot(t, scope))
})

test('metadata', async (t) => {
  const { library } = t.context
  const response = fixture('library/metadata.json')

  const scope = nock(URI)
    .get('/library/metadata/74892')
    .reply(200, response)

  await library.metadata(74892, ALBUM).then(snapshot(t, scope))
})

test('metadataChildren', async (t) => {
  const { library } = t.context
  const response = fixture('library/metadataChildren.json')

  const scope = nock(URI)
    .get('/library/metadata/41409/children')
    .reply(200, response)

  await library.metadataChildren(41409, TRACK).then(snapshot(t, scope))
})

test('countries', async (t) => {
  const { library } = t.context
  const response = fixture('library/countries.json')

  const scope = nock(URI)
    .get('/library/sections/1/country')
    .reply(200, response)

  await library.countries(1).then(snapshot(t, scope))
})

test('genres', async (t) => {
  const { library } = t.context
  const response = fixture('library/genres.json')

  const scope = nock(URI)
    .get('/library/sections/1/genre')
    .reply(200, response)

  await library.genres(1).then(snapshot(t, scope))
})

test('tracks', async (t) => {
  const { library } = t.context
  const response = fixture('library/tracks.json')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 10,
    })
    .reply(200, response)

  await library.tracks(1).then(snapshot(t, scope))
})

test('track', async (t) => {
  const { library } = t.context
  const response = fixture('library/track.json')

  const scope = nock(URI)
    .get('/library/metadata/35341')
    .reply(200, response)

  await library.track(35341).then(snapshot(t, scope))
})

test('albums', async (t) => {
  const { library } = t.context
  const response = fixture('library/albums.json')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 9,
    })
    .reply(200, response)

  await library.albums(1).then(snapshot(t, scope))
})

test('album', async (t) => {
  const { library } = t.context
  const response = fixture('library/album.json')

  const scope = nock(URI)
    .get('/library/metadata/40812')
    .reply(200, response)

  await library.album(40812).then(snapshot(t, scope))
})

test('albumTracks', async (t) => {
  const { library } = t.context
  const response = fixture('library/albumTracks.json')

  const scope = nock(URI)
    .get('/library/metadata/40812/children')
    .reply(200, response)

  await library.albumTracks(40812).then(snapshot(t, scope))
})

test('artist', async (t) => {
  const { library } = t.context
  const response = fixture('library/artist.json')

  const scope = nock(URI)
    .get('/library/metadata/8670')
    .query({
      includePopularLeaves: 1,
    })
    .reply(200, response)

  await library.artist(8670, { includePopular: true }).then(snapshot(t, scope))
})

test('artists', async (t) => {
  const { library } = t.context
  const response = fixture('library/artists.json')

  const scope = nock(URI)
    .get('/library/sections/1/all')
    .query({
      type: 8,
    })
    .reply(200, response)

  await library.artists(1).then(snapshot(t, scope))
})

test('playlists', async (t) => {
  const { library } = t.context
  const response = fixture('library/playlists.json')

  const scope = nock(URI)
    .get('/playlists/all')
    .query({
      type: 15,
    })
    .reply(200, response)

  await library.playlists().then(snapshot(t, scope))
})

test('playlist', async (t) => {
  const { library } = t.context
  const response = fixture('library/playlist.json')

  const scope = nock(URI)
    .get('/playlists/45606')
    .reply(200, response)

  await library.playlist(45606).then(snapshot(t, scope))
})

test('playlistTracks', async (t) => {
  const { library } = t.context
  const response = fixture('library/playlistTracks.json')

  const scope = nock(URI)
    .get('/playlists/123/items')
    .reply(200, response)

  await library.playlistTracks(123).then(snapshot(t, scope))
})

test('playQueue', async (t) => {
  const { library } = t.context
  const response = fixture('library/playQueue.json')

  const scope = nock(URI)
    .get('/playQueues/3147')
    .reply(200, response)

  await library.playQueue(3147).then(snapshot(t, scope))
})

test('shufflePlayQueue', async (t) => {
  const { library } = t.context
  const response = fixture('library/playQueue.json')

  const scope = nock(URI)
    .put('/playQueues/3921/shuffle')
    .reply(200, response)

  await library.shufflePlayQueue(3921).then(snapshot(t, scope))
})

test('unshufflePlayQueue', async (t) => {
  const { library } = t.context
  const response = fixture('library/playQueue.json')

  const scope = nock(URI)
    .put('/playQueues/3921/unshuffle')
    .reply(200, response)

  await library.unshufflePlayQueue(3921).then(snapshot(t, scope))
})

test('searchAll', async (t) => {
  const { library } = t.context
  const response = fixture('library/searchAll.json')

  const scope = nock(URI)
    .get('/hubs/search')
    .query({
      query: 'ride',
      limit: 10,
    })
    .reply(200, response)

  await library.searchAll('ride', 10).then(snapshot(t, scope))
})

test('resizePhoto', (t) => {
  const { library } = t.context

  const image = 'https://images.unsplash.com/photo-1429728001698-8ba1c4c64783'
  const encodedImage = encodeURIComponent(image)

  const url = library.resizePhoto({
    uri: image,
    width: 200,
    height: 200,
  })

  t.is(
    url,
    `${URI}/photo/:/transcode?uri=${encodedImage}&width=200&height=200&X-Plex-Token=xxxx`,
  )
})
