import Prism from '@zwolf/prism'

import { toNumber } from './types'

const toTotalSize = ($data: Prism<any>): number => {
  if ($data.has('totalSize')) {
    return $data.get('totalSize').transform(toNumber).value
  }
  return $data.get('size').transform(toNumber).value
}

export interface MediaContainer {
  _type: string,
  size: number,
  totalSize: number,
  offset: number,
  identifier: string,
  mediaTagPrefix: string,
  mediaTagVersion: string,
}

const toMediaContainer = ($data: Prism<any>): MediaContainer => {
  return {
    _type: 'mediaContainer',

    size: $data.get('size').transform(toNumber).value,
    totalSize: $data.transform(toTotalSize).value,
    offset: $data.get('offset', { quiet: true }).transform(toNumber).value,

    identifier: $data.get('identifier', { quiet: true }).value,
    mediaTagPrefix: $data.get('mediaTagPrefix', { quiet: true }).value,
    mediaTagVersion: $data.get('mediaTagVersion', { quiet: true }).value,
  }
}

export { toMediaContainer }
