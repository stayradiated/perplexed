import test from 'ava'
import nock from 'nock'

import {Account} from '../lib'

const PLEX_API = 'https://plex.tv'
const AUTH_TOKEN = 'AUTH_TOKEN'
const CLIENT_HEADERS = {
  CLIENT_HEADERS: true,
}

test.beforeEach((t) => {
  t.context.client = {
    headers: () => CLIENT_HEADERS,
  }
  t.context.account = new Account(t.context.client, AUTH_TOKEN)
})

test('constructor without auth token', (t) => {
  const account = new Account(t.context.client)
  t.is(account.client, t.context.client)
  t.is(account.authToken, undefined)
})

test('constructor with auth token', (t) => {
  const {account} = t.context
  t.is(account.client, t.context.client)
  t.is(account.authToken, AUTH_TOKEN)
})

test('headers', (t) => {
  const {account} = t.context
  t.deepEqual(account.headers(), {
    ...CLIENT_HEADERS,
    'X-Plex-Token': AUTH_TOKEN,
  })
})

test('fetchJSON', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API, {reqheaders: {accept: 'application/json'}})
    .get('/path')
    .reply(200, {
      key: 'value',
    })

  return account.fetchJSON('/path').then((res) => {
    scope.done()
    t.deepEqual(res, {key: 'value'})
  })
})

test('fetchJSON with params', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API, {reqheaders: {accept: 'application/json'}})
    .get('/path?name=plex')
    .reply(200, {
      key: 'value',
    })

  return account.fetchJSON('/path', {
    params: {
      name: 'plex',
    },
  }).then((res) => {
    scope.done()
    t.deepEqual(res, {key: 'value'})
  })
})


test('fetchXML', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .get('/path')
    .reply(200, '<container size="20"><name>Plex</name></container>')

  return account.fetchXML('/path').then((res) => {
    scope.done()
    t.deepEqual(res, {
      container: {
        $: {size: '20'},
        name: ['Plex'],
      },
    })
  })
})

test('fetchXML with params', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .get('/path?name=plex')
    .reply(200, '<container size="20"><name>Plex</name></container>')

  return account.fetchXML('/path', {
    params: {
      name: 'plex',
    },
  }).then((res) => {
    scope.done()
    t.deepEqual(res, {
      container: {
        $: {size: '20'},
        name: ['Plex'],
      },
    })
  })
})

test('authenticate failure', (t) => {
  const account = new Account(t.context.client)

  const username = 'username'
  const password = 'password'

  const scope = nock(PLEX_API)
    .post('/users/sign_in.json')
    .reply(401, {
      error: 'Invalid email, username, or password.',
    })

  return account.authenticate(username, password).catch((res) => {
    scope.done()
    t.is(res.error, 'Invalid email, username, or password.')
  })
})

test('authenticate', (t) => {
  const account = new Account(t.context.client)

  const username = 'username'
  const password = 'password'

  const scope = nock(PLEX_API)
    .post('/users/sign_in.json')
    .reply(200, {
      user: {
        authToken: AUTH_TOKEN,
      },
    })

  return account.authenticate(username, password).then((user) => {
    scope.done()
    t.truthy(user)
    t.is(account.authToken, AUTH_TOKEN)
  })
})


test('info', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .get('/api/v2/user')
    .reply(200, {
      username: 'stayradiated',
    })

  return account.info().then((user) => {
    scope.done()
    t.is(user.username, 'stayradiated')
  })
})

test('resources', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .get('/api/resources?includeHttps=1&includeRelay=1')
    .reply(200, '<MediaContainer size="0"></MediaContainer>')

  return account.resources().then((resources) => {
    scope.done()
    t.is(resources.devices.length, 0)
  })
})

test('devices', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .get('/devices.json')
    .reply(200, {})

  return account.devices().then((devices) => {
    scope.done()
    t.truthy(devices)
  })
})

test('removeDevice', (t) => {
  const {account} = t.context

  const scope = nock(PLEX_API)
    .delete('/devices/123.json')
    .reply(200, {})

  return account.removeDevice(123).then(() => {
    scope.done()
  })
})
