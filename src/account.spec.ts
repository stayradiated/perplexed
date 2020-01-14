import anyTest, { TestInterface } from 'ava'
import nock from 'nock'

import { fixture, snapshot } from './test-helpers'

import Account from './account'
import Client from './client'

nock.disableNetConnect()

const test = anyTest as TestInterface<{
  client: Client,
  account: Account,
}>

const PLEX_API = 'https://plex.tv'
const AUTH_TOKEN = 'AUTH_TOKEN'
const CLIENT_HEADERS = {
  CLIENT_HEADERS: 'true',
}

test.beforeEach((t) => {
  t.context.client = {
    device: '',
    deviceName: '',
    identifier: '',
    platform: '',
    platformVersion: '',
    product: '',
    version: '',
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
  const { account } = t.context
  t.is(account.client, t.context.client)
  t.is(account.authToken, AUTH_TOKEN)
})

test('headers', (t) => {
  const { account } = t.context
  t.deepEqual(account.headers(), {
    ...CLIENT_HEADERS,
    'X-Plex-Token': AUTH_TOKEN,
  })
})

test('fetch', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API, { reqheaders: { accept: 'application/json' } })
    .get('/fetch')
    .reply(200, {
      key: 'value',
    })

  const res = await account.fetch('/fetch')

  t.deepEqual(res, { key: 'value' })

  scope.done()
})

test('fetch with params', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API, { reqheaders: { accept: 'application/json' } })
    .get('/fetch-with-params?name=plex')
    .reply(200, {
      key: 'value',
    })

  const res = await account.fetch('/fetch-with-params', {
    searchParams: {
      name: 'plex',
    },
  })

  t.deepEqual(res, { key: 'value' })

  scope.done()
})

test('fetchXML', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API)
    .get('/fetch-xml')
    .reply(200, '<container size="20"><name>Plex</name></container>')

  const res = await account.fetchXML('/fetch-xml')

  t.deepEqual(res, {
    container: {
      $: { size: '20' },
      name: ['Plex'],
    },
  })

  scope.done()
})

test('fetchXML with params', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API)
    .get('/fetch-xml-with-params?name=plex')
    .reply(200, '<container size="20"><name>Plex</name></container>')

  const res = await account.fetchXML('/fetch-xml-with-params', {
    searchParams: {
      name: 'plex',
    },
  })

  t.deepEqual(res, {
    container: {
      $: { size: '20' },
      name: ['Plex'],
    },
  })

  scope.done()
})

test('authenticate failure', async (t) => {
  const account = new Account(t.context.client)

  const username = 'username'
  const password = 'password'

  const scope = nock(PLEX_API)
    .post('/api/v2/users/signin')
    .reply(401, {
      error: 'Invalid email, username, or password.',
    })

  t.plan(1)

  try {
    await account.authenticate(username, password)
  } catch (error) {
    const errorRes = await error.response.json()
    t.deepEqual(errorRes, {
      error: 'Invalid email, username, or password.',
    })
  }

  scope.done()
})

test('authenticate', async (t) => {
  const account = new Account(t.context.client)
  const response = fixture('user.json')

  const username = 'username'
  const password = 'password'

  const scope = nock(PLEX_API)
    .post('/api/v2/users/signin')
    .reply(200, response)

  await account.authenticate(username, password).then(snapshot(t, scope))
})

test('info', async (t) => {
  const { account } = t.context
  const response = fixture('user.json')

  const scope = nock(PLEX_API)
    .get('/api/v2/user')
    .reply(200, response)

  await account.info().then(snapshot(t, scope))
})

test('resources', async (t) => {
  const { account } = t.context
  const response = fixture('resources.xml')

  const scope = nock(PLEX_API)
    .get('/api/resources?includeHttps=1&includeRelay=1')
    .reply(200, response)

  await account.resources().then(snapshot(t, scope))
})

test('servers', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API)
    .get('/api/resources?includeHttps=1&includeRelay=1')
    .reply(
      200,
      `<MediaContainer size="3">
        <Device clientIdentifier="1" provides="server" />
        <Device clientIdentifier="2" provides="client" />
        <Device clientIdentifier="3" provides="client,server" />
      </MediaContainer>`,
    )

  const servers = await account.servers()

  t.is(servers.devices.length, 2)
  t.is(servers.devices[0].clientIdentifier, '1')
  t.is(servers.devices[1].clientIdentifier, '3')

  scope.done()
})

test('devices', async (t) => {
  const { account } = t.context
  const response = fixture('devices.xml')

  const scope = nock(PLEX_API)
    .get('/devices.xml')
    .reply(200, response)

  await account.devices().then(snapshot(t, scope))
})

test('removeDevice', async (t) => {
  const { account } = t.context

  const scope = nock(PLEX_API)
    .delete('/devices/123.json')
    .reply(200, {})

  await account.removeDevice('123')

  t.pass()

  scope.done()
})
