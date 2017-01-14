import {schema} from 'normalizr'

import {parseMediaContainer} from './mediaContainer'
import {parseTrack, trackSchema} from './track'

export const playQueueItemSchema = new schema.Object({
  track: trackSchema,
})
export const playQueueContainerSchema = new schema.Object({
  items: new schema.Array(playQueueItemSchema),
})

export function parsePlayQueueItem (data) {
  const {
    playQueueItemID: id = null,
    guid = null,
    librarySectionID: librarySectionId = null,
  } = data

  return {
    _type: 'playQueueItem',
    id,
    guid,
    librarySectionId,
    track: parseTrack(data),
  }
}

export function parsePlayQueue (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    playQueueID: id = null,
    playQueueSelectedItemID: selectedItemId = null,
    playQueueSelectedItemOffset: selectedItemOffset = null,
    playQueueSelectedMetadataItemID: selectedMetadataItemId = null,
    playQueueShuffled: shuffled = null,
    playQueueSourceURI: sourceURI = null,
    playQueueTotalCount: totalCount = null,
    playQueueVersion: version = null,
    Metadata = [],
  } = data

  return {
    ...parseMediaContainer(data),
    _type: 'playQueueContainer',
    id,
    selectedItemId,
    selectedItemOffset,
    selectedMetadataItemId,
    shuffled,
    sourceURI,
    totalCount,
    version,
    items: Metadata.map(parsePlayQueueItem),
  }
}
