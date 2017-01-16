import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'

export const connectionSchema = new schema.Entity('connections', {}, {
  idAttribute: 'uri',
})
export const deviceSchema = new schema.Entity('devices', {
  connections: new schema.Array(connectionSchema),
})
export const resourceContainerSchema = new schema.Object({
  devices: new schema.Array(deviceSchema),
})

export function parseBool (value) {
  return (
    value === '1' ||
    value === 'true' ||
    value === true
  )
}

export function parseConnection (data) {
  const {
    protocol = null,
    address = null,
    port = null,
    uri = null,
    local = null,
  } = data.$

  return {
    _type: 'connection',
    protocol,
    address,
    port,
    uri,
    local: parseBool(local),
  }
}

export function parseDevice (data) {
  const {
    name = null,
    product = null,
    productVersion = null,
    platform = null,
    platformVersion = null,
    device = null,
    clientIdentifier = null,
    createdAt = null,
    lastSeenAt = null,
    provides = '',
    owned = null,
    accessToken = null,
    publicAddress = null,
    publicAddressMatches = null,
    presence = null,
  } = data.$

  const {
    Connection = [],
  } = data

  return {
    _type: 'device',
    id: clientIdentifier,
    name,
    product,
    productVersion,
    platform,
    platformVersion,
    device,
    clientIdentifier,
    createdAt: parseInt(createdAt, 10) * 1000,
    lastSeenAt: parseInt(lastSeenAt, 10) * 1000,
    provides: provides.split(','),
    owned: parseBool(owned),
    accessToken,
    publicAddress,
    publicAddressMatches: parseBool(publicAddressMatches),
    presence: parseBool(presence),
    connections: Connection.map(parseConnection),
  }
}

export function parseResources (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    Device = [],
  } = data

  return {
    ...parseMediaContainer(data.$),
    _type: 'resourceContainer',
    devices: Device.map(parseDevice),
  }
}
