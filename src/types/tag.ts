import Prism from '@zwolf/prism'

export interface Tag {
  id: number,
  filter: string,
  tag: string,
}

/**
 * @ignore
 */
const toTag = ($data: Prism<any>): Tag => {
  return {
    id: $data.get<number>('id', { quiet: true }).value,
    filter: $data.get<string>('filter', { quiet: true }).value,
    tag: $data.get<string>('tag').value,
  }
}

/**
 * @ignore
 */
const toTagList = ($data: Prism<any>) => {
  return $data.toArray().map(toTag)
}

export { toTagList }
