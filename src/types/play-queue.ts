import Prism from '@zwolf/prism'
import { schema } from 'normalizr'

import { createParser } from './parser'

import { toMediaContainer } from './media-container'
import { toTrack, trackSchema } from './track'

/**
 * @ignore
 */
const playQueueItemSchema = new schema.Object({
  track: trackSchema,
})

/**
 * @ignore
 */
const playQueueContainerSchema = new schema.Object({
  items: new schema.Array(playQueueItemSchema),
})

/**
 * @ignore
 */
const toPlayQueueItem = ($data: Prism<any>) => {
  return {
    _type: 'playQueueItem',
    id: $data.get('playQueueItemID').value,
    guid: $data.get('guid').value,
    librarySectionId: $data.get('librarySectionID').value,
    track: $data.transform(toTrack).value,
  }
}

/**
 * @ignore
 */
const toPlayQueue = ($data: Prism<any>) => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'playQueueContainer',

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

/**
 * @ignore
 */
const parsePlayQueue = createParser('playQueue', toPlayQueue)

export {
  playQueueItemSchema,
  playQueueContainerSchema,
  toPlayQueueItem,
  toPlayQueue,
  parsePlayQueue,
}
