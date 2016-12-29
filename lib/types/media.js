import parsePart from './part'

export default function parseMedia (data) {
  const media = {}

  media.id = data.id
  media.duration = data.duration
  media.bitrate = data.bitrate
  media.audioChannels = data.audioChannels
  media.audioCodec = data.audioCodec
  media.container = data.container

  media.part = data.Part.map((part) => {
    return  parsePart(part)
  })

  return media
}
