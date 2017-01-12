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
  const playQueueItem = {}

  playQueueItem._type = 'playQueueItem'

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

  playQueue._type = 'playQueueContainer'

  playQueue.id                     = data.playQueueID
  playQueue.selectedItemId         = data.playQueueSelectedItemID
  playQueue.selectedItemOffset     = data.playQueueSelectedItemOffset
  playQueue.selectedMetadataItemId = data.playQueueSelectedMetadataItemID
  playQueue.shuffled               = data.playQueueShuffled
  playQueue.sourceURI              = data.playQueueSourceURI
  playQueue.totalCount             = data.playQueueTotalCount
  playQueue.version                = data.playQueueVersion

  playQueue.items = (data.Metadata || []).map(parsePlayQueueItem)

  return playQueue
}
