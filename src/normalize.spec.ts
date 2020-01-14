import anyTest, { TestInterface } from 'ava'

import { normalizeSync } from './normalize'
import { Artist } from './types/artist'

const test = anyTest as TestInterface<{}>

const ARTIST: Artist = {
  _type: 'artist',
  id: 1,
  genre: [],
  country: [],
  popularTracks: [],
  addedAt: new Date(),
  art: '',
  deletedAt: new Date(),
  guid: '',
  index: 0,
  key: '',
  lastViewedAt: new Date(),
  ratingKey: '',
  summary: '',
  thumb: '',
  title: '',
  titleSort: '',
  type: '',
  updatedAt: new Date(),
  viewCount: 0,
}

test('normalizeSync', (t) => {
  const res = normalizeSync({
    _type: 'artistContainer',
    artists: [ARTIST],
  })

  t.deepEqual(res, {
    entities: {
      artists: {
        1: ARTIST,
      },
    },
    result: {
      id: { _type: 'artistContainer', artists: [1] },
      schema: 'artistContainer',
    },
  })
})
