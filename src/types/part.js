// import {parseStream} from './stream'

export function parsePart (data) {
  const {
    id = null,
    key = null,
    duration = null,
    file = null,
    size = null,
    container = null,
    hasThumbnail = null
    // Stream,
  } = data

  return {
    _type: 'part',
    id,
    key,
    duration,
    file,
    size,
    container,
    hasThumbnail
    // stream: parseStream(Stream),
  }
}
