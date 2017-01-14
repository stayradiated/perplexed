export function parseMediaContainer (data) {
  const {
    size = null,
    offset = 0,
    totalSize = null,
    identifier = null,
    mediaTagPrefix = null,
    mediaTagVersion = null,
  } = data

  return {
    _type: 'mediaContainer',

    size,
    offset,
    totalSize: totalSize || size,
    identifier,
    mediaTagPrefix,
    mediaTagVersion,
  }
}
