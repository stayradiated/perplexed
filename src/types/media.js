import { parsePart } from './part'

export function parseMedia (data) {
  const {
    id = null,
    duration = null,
    bitrate = null,
    audioChannels = null,
    audioCodec = null,
    container = null,
    Part: parts = []
  } = data

  return {
    _type: 'media',
    id,
    duration,
    bitrate,
    audioChannels,
    audioCodec,
    container,
    parts: parts.map(parsePart)
  }
}
