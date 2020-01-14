import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { Device, toDevice, deviceSchema } from './device'

const resourceContainerSchema = new schema.Object({
  devices: new schema.Array(deviceSchema),
})

export interface ResourceContainer {
  _type: string,
  devices: Device[],
}

const toResourceContainer = ($data: Prism<any>): ResourceContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    _type: 'resourceContainer',

    devices: $data
      .get('Device')
      .toArray()
      .map(toDevice),
  }
}

const parseResourceContainer = createParser(
  'resourceContainer',
  toResourceContainer,
)

export { resourceContainerSchema, toResourceContainer, parseResourceContainer }
