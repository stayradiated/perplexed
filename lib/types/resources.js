import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'

export const connectionSchema = new schema.Entity('connections', {
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
  const connection = {}

  connection._type = 'connection'

  connection.protocol = data.$.protocol
  connection.address  = data.$.address
  connection.port     = data.$.port
  connection.uri      = data.$.uri
  connection.local    = parseBool(data.$.local)

  return connection
}

export function parseDevice (data) {
  const device = {}

  device._type = 'device'

  device.name                 = data.$.name
  device.product              = data.$.product
  device.productVersion       = data.$.productVersion
  device.platform             = data.$.platform
  device.platformVersion      = data.$.platformVersion
  device.device               = data.$.device
  device.clientIdentifier     = data.$.clientIdentifier
  device.createdAt            = parseInt(data.$.createdAt, 10) * 1000
  device.lastSeenAt           = parseInt(data.$.lastSeenAt, 10) * 1000
  device.provides             = data.$.provides.split(',')
  device.owned                = parseBool(data.$.owned)
  device.accessToken          = data.$.accessToken
  device.publicAddress        = data.$.publicAddress
  device.publicAddressMatches = parseBool(data.$.publicAddressMatches)
  device.presence             = parseBool(data.$.presence)

  device.id = device.clientIdentifier

  device.connections = (data.Connection || []).map(parseConnection)

  return device
}

export function parseResources (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const container = {
    ...parseMediaContainer(data.$),
  }

  container._type = 'resourceContainer'

  container.devices = (data.Device || []).map(parseDevice)

  return container
}
