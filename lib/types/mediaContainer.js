export function parseMediaContainer (data) {
  const mediaContainer = {}

  mediaContainer._type = 'mediaContainer'

  mediaContainer.size      = data.size
  mediaContainer.offset    = data.offset || 0
  mediaContainer.totalSize = data.totalSize || data.size

  if (data.identifier != null) {
    mediaContainer.identifier      = data.identifier
  }

  if (data.mediaTagPrefix != null) {
    mediaContainer.mediaTagPrefix  = data.mediaTagPrefix
  }

  if (data.mediaTagVersion != null) {
    mediaContainer.mediaTagVersion = data.mediaTagVersion
  }

  return mediaContainer
}
