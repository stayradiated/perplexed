export default function parseMediaContainer (data) {
  const mediaContainer = {}

  mediaContainer.size            = data.size
  mediaContainer.totalSize       = data.totalSize || data.size
  mediaContainer.identifier      = data.identifier
  mediaContainer.mediaTagPrefix  = data.mediaTagPrefix
  mediaContainer.mediaTagVersion = data.mediaTagVersion

  return mediaContainer
}
