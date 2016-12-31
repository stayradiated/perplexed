import test from 'ava'
import nock from 'nock'

import PlexClient from '../lib'

const HOSTNAME = 'http://192.168.1.100:32400'

test.beforeEach((t) => {
  t.context.client = new PlexClient({
    hostname: '192.168.1.100',
    port: '32400',
  })
})

test('normalizedPlaylists - get all', (t) => {
  const {client} = t.context

  nock(HOSTNAME)
    .get('/playlists/all')
    .query({
      type: 15,
      sort: 'titleSort:asc',
    })
    .reply(200, {
      MediaContainer: {
        Metadata: [{
          addedAt: 1472017702,
          composite: '/playlists/33918/composite/1483152764',
          duration: 384076000,
          guid: 'com.plexapp.agents.none://3e114e36-d43e-4d93-af5f-b579c9e00e26',
          key: '/playlists/33918/items',
          lastViewedAt: 1483098578,
          leafCount: 1580,
          playlistType: 'audio',
          ratingKey: 33918,
          smart: 1,
          summary: '',
          title: 'Worth A Listen',
          type: 'playlist',
          updatedAt: 1483152764,
          viewCount: 2,
        }],
      },
    })

  return client.normalizedPlaylists()
    .then((playlists) => {
      console.log(playlists)
    })
})
