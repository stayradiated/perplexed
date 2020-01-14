import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { toBoolean, toDateFromSeconds } from './types'

const connectionSchema = new schema.Entity(
  'connections',
  {},
  {
    idAttribute: 'uri',
  },
)
const deviceSchema = new schema.Entity('devices', {
  connections: new schema.Array(connectionSchema),
})
const deviceContainerSchema = new schema.Object({
  devices: new schema.Array(deviceSchema),
})

export interface Connection {
  _type: string,
  protocol: string,
  address: string,
  port: string,
  uri: string,
  local: boolean,
}

const toConnection = ($data: Prism<any>): Connection => {
  const $prop = $data.get('$')
  return {
    _type: 'connection',
    protocol: $prop.get('protocol', { quiet: true }).value,
    address: $prop.get('address', { quiet: true }).value,
    port: $prop.get('port', { quiet: true }).value,
    uri: $prop.get('uri').value,
    local: $prop.get('local', { quiet: true }).transform(toBoolean).value,
  }
}

export interface Device {
  _type: string,
  id: string,

  connections: Connection[],

  name: string,
  product: string,
  productVersion: string,
  platform: string,
  platformVersion: string,
  device: string,
  clientIdentifier: string,
  createdAt: Date,
  lastSeenAt: Date,
  provides: string[],
  owned: boolean,
  accessToken: string,
  publicAddress: string,
  httpsRequired: boolean,
  synced: boolean,
  relay: boolean,
  dnsRebindingProtection: boolean,
  natLoopbackSupported: boolean,
  publicAddressMatches: boolean,
  presence: boolean,
}

const toDevice = ($data: Prism<any>): Device => {
  const $prop = $data.get('$')

  return {
    _type: 'device',

    id: $prop.get('clientIdentifier').value,

    connections: $data
      .get('Connection', { quiet: true })
      .toArray()
      .map(toConnection),

    name: $prop.get('name', { quiet: true }).value,
    product: $prop.get('product', { quiet: true }).value,
    productVersion: $prop.get('productVersion', { quiet: true }).value,
    platform: $prop.get('platform', { quiet: true }).value,
    platformVersion: $prop.get('platformVersion', { quiet: true }).value,
    device: $prop.get('device', { quiet: true }).value,
    clientIdentifier: $prop.get('clientIdentifier').value,
    createdAt: $prop
      .get('createdAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    lastSeenAt: $prop
      .get('lastSeenAt', { quiet: true })
      .transform(toDateFromSeconds).value,
    provides: $prop.get('provides').transform((prism): string[] => {
      if (typeof prism.value === 'string') {
        return prism.value.split(',')
      }
      return []
    }).value,
    owned: $prop.get('owned', { quiet: true }).transform(toBoolean).value,
    accessToken: $prop.get('accessToken', { quiet: true }).value,
    publicAddress: $prop.get('publicAddress', { quiet: true }).value,
    httpsRequired: $prop
      .get('httpsRequired', { quiet: true })
      .transform(toBoolean).value,
    synced: $prop.get('synced', { quiet: true }).transform(toBoolean).value,
    relay: $prop.get('relay', { quiet: true }).transform(toBoolean).value,
    dnsRebindingProtection: $prop
      .get('dnsRebindingProtection', { quiet: true })
      .transform(toBoolean).value,
    natLoopbackSupported: $prop
      .get('natLoopbackSupported', { quiet: true })
      .transform(toBoolean).value,
    publicAddressMatches: $prop
      .get('publicAddressMatches', { quiet: true })
      .transform(toBoolean).value,
    presence: $prop.get('presence', { quiet: true }).transform(toBoolean).value,
  }
}

const toDeviceList = ($data: Prism<any>): Device[] => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return $data
    .get('Device')
    .toArray()
    .map(toDevice)
}

const parseDeviceList = createParser('deviceList', toDeviceList)

export {
  connectionSchema,
  deviceSchema,
  deviceContainerSchema,
  toDevice,
  toDeviceList,
  parseDeviceList,
}
