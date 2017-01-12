import test from 'ava'

import normalizeResponse from '../lib/normalize'

test('normalizeResponse', (t) => {
  normalizeResponse(Promise.resolve({
    _type: 'artistContainer',
    artists: [{
      _type: 'artist',
      id: 1,
    }],
  })).then((res) => {
    t.deepEqual(res, {
      entities: {
        artists: {
          1: {_type: 'artist', id: 1},
        },
      },
      result: {
        id: {_type: 'artistContainer', artists: [1]},
        schema: 'artistContainer',
      },
    })
  })
})
