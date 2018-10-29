import { parseBool } from './types'

export function parseStream (data = {}) {
  const {
    id = null,
    key = null,
    streamType = null,
    selected = null,
    codec = null,
    format = null,
    provider = null,
    timed = null,
    index = null,
    channels = null,
    bitrate = null,
    audioChannelLayout = null,
    samplingRate = null
  } = data

  return {
    _type: 'stream',
    id,
    key,
    streamType,
    selected,
    codec,
    format,
    provider,
    timed: parseBool(timed),
    index,
    channels,
    bitrate,
    audioChannelLayout,
    samplingRate
  }
}
