export function parseStream (data = {}) {
  const {
    id = null,
    streamType = null,
    selected = null,
    codec = null,
    index = null,
    channels = null,
    bitrate = null,
    audioChannelLayout = null,
    samplingRate = null
  } = data

  return {
    _type: 'stream',
    id,
    streamType,
    selected,
    codec,
    index,
    channels,
    bitrate,
    audioChannelLayout,
    samplingRate
  }
}
