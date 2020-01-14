import Prism from '@zwolf/prism'

import { toBoolean } from './types'

export interface Stream {
  _type: string,
  audioChannelLayout: string,
  bitrate: number,
  channels: number,
  codec: string,
  format: string,
  id: number,
  index: number,
  key: string,
  provider: string,
  samplingRate: number,
  selected: boolean,
  streamType: number,
  timed: boolean,
}

const toStream = ($data: Prism<any>): Stream => {
  return {
    _type: 'stream',
    audioChannelLayout: $data.get('audioChannelLayout', { quiet: true }).value,
    bitrate: $data.get('bitrate', { quiet: true }).value,
    channels: $data.get('channels', { quiet: true }).value,
    codec: $data.get('codec').value,
    format: $data.get('format', { quiet: true }).value,
    id: $data.get('id').value,
    index: $data.get('index', { quiet: true }).value,
    key: $data.get('key', { quiet: true }).value,
    provider: $data.get('provider', { quiet: true }).value,
    samplingRate: $data.get('samplingRate', { quiet: true }).value,
    selected: $data.get('selected', { quiet: true }).value,
    streamType: $data.get('streamType').value,
    timed: $data.get('timed', { quiet: true }).transform(toBoolean).value,
  }
}

export { toStream }
