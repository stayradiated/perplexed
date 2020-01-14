import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { toMediaContainer } from './mediaContainer'
import { toTrack, trackSchema } from './track'

const playQueueItemSchema = new schema.Object({
  track: trackSchema,
})
const playQueueContainerSchema = new schema.Object({
  items: new schema.Array(playQueueItemSchema),
})

const toPlayQueueItem = ($data: Prism<any>) => {
  return {
    _type: 'playQueueItem',
    id: $data.get('playQueueItemID').value,
    guid: $data.get('guid').value,
    librarySectionId: $data.get('librarySectionID').value,
    track: $data.transform(toTrack).value,
  }
}

const toPlayQueue = ($data: Prism<any>) => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    _type: 'playQueueContainer',

    ...$data.transform(toMediaContainer).value,

    id: $data.get('playQueueID').value,
    selectedItemId: $data.get('playQueueSelectedItemID').value,
    selectedItemOffset: $data.get('playQueueSelectedItemOffset').value,
    selectedMetadataItemId: $data.get('playQueueSelectedMetadataItemID').value,
    shuffled: $data.get('playQueueShuffled').value,
    sourceURI: $data.get('playQueueSourceURI').value,
    totalCount: $data.get('playQueueTotalCount').value,
    version: $data.get('playQueueVersion').value,

    items: $data
      .get('Metadata')
      .toArray()
      .map(toPlayQueueItem),
  }
}

const parsePlayQueue = createParser('playQueue', toPlayQueue)

export {
  playQueueItemSchema,
  playQueueContainerSchema,
  toPlayQueueItem,
  toPlayQueue,
  parsePlayQueue,
}
