import Prism from '@zwolf/prism'

import { createParser } from './parser'

import { toNumber } from './types'

export interface Genre {
  id: number,
  title: string,
}

/**
 * @ignore
 */
const toGenre = ($data: Prism<any>): Genre => {
  return {
    id: $data.get<string>('key').transform(toNumber).value,
    title: $data.get<string>('title').value,
  }
}

export type GenreRecord = Record<string, number>

/**
 * @ignore
 */
const toGenreRecord = ($data: Prism<any>): GenreRecord => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  const genresArray = $data
    .get('Directory')
    .toArray()
    .map(toGenre)

  const genresObject = genresArray.reduce((obj, genre) => {
    obj[genre.title] = genre.id
    return obj
  }, {} as Record<string, number>)

  return genresObject
}

/**
 * @ignore
 */
const parseGenreRecord = createParser('genreRecord', toGenreRecord)

export { toGenre, toGenreRecord, parseGenreRecord }
