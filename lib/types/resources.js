export function parseBool (value) {
  return (
    value === '1' ||
    value === 'true' ||
    value === true
  )
}

export function parseConnection (data) {
  const connection = {}

  connection.protocol = data.$.protocol
  connection.address  = data.$.address
  connection.port     = data.$.port
  connection.uri      = data.$.uri
  connection.local    = parseBool(data.$.local)

  return connection
}

export function parseDevice (data) {
  const device = {}

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

  device.connections = data.Connection.map(parseConnection)

  return device
}

export function parseResources (data) {
  const container = {}

  container.size = data.MediaContainer.$.size
  container.devices = (data.MediaContainer.Device || []).map(parseDevice)

  return container
}
