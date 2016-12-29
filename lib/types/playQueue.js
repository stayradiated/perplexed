import {schema} from 'normalizr'

import parseMediaContainer from './mediaContainer'
import {parseTrack, trackSchema} from './track'

export const playQueueSchema = new schema.Object({
  items: new schema.Array(new schema.Object({
    track: trackSchema,
  })),
})

export function parsePlayQueueItem (data) {
  const playQueueItem = {}

  playQueueItem.id = data.playQueueItemID
  playQueueItem.guid = data.guid
  playQueueItem.librarySectionId = data.librarySectionID

  playQueueItem.track = parseTrack(data)

  return playQueueItem
}

export function parsePlayQueue (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const playQueue = {
    ...parseMediaContainer(data),
  }

  playQueue.id                     = data.playQueueID
  playQueue.selectedItemId         = data.playQueueSelectedItemID
  playQueue.selectedItemOffset     = data.playQueueSelectedItemOffset
  playQueue.selectedMetadataItemId = data.playQueueSelectedMetadataItemID
  playQueue.shuffled               = data.playQueueShuffled
  playQueue.sourceURI              = data.playQueueSourceURI
  playQueue.totalCount             = data.playQueueTotalCount
  playQueue.version                = data.playQueueVersion

  playQueue.items = data.Metadata.map(parsePlayQueueItem)

  return playQueue
}
