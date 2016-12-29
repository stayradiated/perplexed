export default function parseStream (data) {
  const stream = {}

  stream.id                 = data.id
  stream.streamType         = data.streamType
  stream.selected           = data.selected
  stream.codec              = data.codec
  stream.index              = data.index
  stream.channels           = data.channels
  stream.bitrate            = data.bitrate
  stream.audioChannelLayout = data.audioChannelLayout
  stream.samplingRate       = data.samplingRate

  return stream
}
