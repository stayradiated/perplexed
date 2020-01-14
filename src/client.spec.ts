import anyTest, { TestInterface } from 'ava'
import os from 'os'

import Client from './client'

const test = anyTest as TestInterface<{}>

test('should create a new client with default options', (t) => {
  const client = new Client()
  t.is(typeof client.identifier, 'string')
  t.is(client.identifier.length, 36)
  t.is(client.product, 'Node.js App')
  t.is(client.version, '1.0.0')
  t.is(client.device, os.platform())
  t.is(client.deviceName, 'Node.js App')
  t.is(client.platform, 'Node.js')
  t.is(client.platformVersion, process.version)
})

test('should allow options to be overwritten', (t) => {
  const client = new Client({
    identifier: 'identifier',
    product: 'product',
    version: 'version',
    device: 'device',
    deviceName: 'deviceName',
    platform: 'platform',
    platformVersion: 'platformVersion',
  })

  t.is(client.identifier, 'identifier')
  t.is(client.product, 'product')
  t.is(client.version, 'version')
  t.is(client.device, 'device')
  t.is(client.deviceName, 'deviceName')
  t.is(client.platform, 'platform')
  t.is(client.platformVersion, 'platformVersion')
})

test('should generate plex headers', (t) => {
  const client = new Client({
    identifier: 'identifier',
    product: 'product',
    version: 'version',
    device: 'device',
    deviceName: 'deviceName',
    platform: 'platform',
    platformVersion: 'platformVersion',
  })

  t.deepEqual(client.headers(), {
    'X-Plex-Client-Identifier': 'identifier',
    'X-Plex-Product': 'product',
    'X-Plex-Version': 'version',
    'X-Plex-Device': 'device',
    'X-Plex-Device-Name': 'deviceName',
    'X-Plex-Platform': 'platform',
    'X-Plex-Platform-Version': 'platformVersion',
    'X-Plex-Provides': 'controller',
  })
})
