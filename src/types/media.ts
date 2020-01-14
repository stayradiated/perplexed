import Prism from '@zwolf/prism'

import { Part, toPart } from './part'

export interface Media {
  _type: string,
  id: string,
  duration: string,
  bitrate: string,
  audioChannels: string,
  audioCodec: string,
  container: string,
  parts: Part[],
}

/**
 * @ignore
 */
const toMedia = ($data: Prism<any>): Media => {
  return {
    _type: 'media',

    id: $data.get('id').value,
    duration: $data.get('duration').value,
    bitrate: $data.get('bitrate').value,
    audioChannels: $data.get('audioChannels').value,
    audioCodec: $data.get('audioCodec').value,
    container: $data.get('container').value,

    parts: $data
      .get('Part')
      .toArray()
      .map(toPart),
  }
}

export { toMedia }
