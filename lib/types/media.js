import {parsePart} from './part'

export function parseMedia (data) {
  const media = {}

  media._type = 'media'

  media.id = data.id
  media.duration = data.duration
  media.bitrate = data.bitrate
  media.audioChannels = data.audioChannels
  media.audioCodec = data.audioCodec
  media.container = data.container

  media.part = (data.Part || []).map(parsePart)

  return media
}
