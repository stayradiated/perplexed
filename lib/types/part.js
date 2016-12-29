import parseStream from './stream'

export default function parsePart (data) {
  const part = {}

  part.id           = data.id
  part.key          = data.key
  part.duration     = data.duration
  part.file         = data.file
  part.size         = data.size
  part.container    = data.container
  part.hasThumbnail = data.hasThumbnail

  if (part.Stream != null) {
    part.stream = part.Stream.map(parseStream)
  }

  return part
}
