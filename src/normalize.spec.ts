import anyTest, { TestInterface } from 'ava'

import normalizeResponse from './normalize'

const test = anyTest as TestInterface<{}>

test('normalizeResponse', async (t) => {
  const res = await normalizeResponse(
    Promise.resolve({
      _type: 'artistContainer',
      artists: [
        {
          _type: 'artist',
          id: 1,
        },
      ],
    }),
  )

  t.deepEqual(res, {
    entities: {
      artists: {
        1: { _type: 'artist', id: 1 },
      },
    },
    result: {
      id: { _type: 'artistContainer', artists: [1] },
      schema: 'artistContainer',
    },
  })
})
