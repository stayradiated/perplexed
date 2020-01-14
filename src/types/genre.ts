import Prism from '@zwolf/prism'

import { createParser } from './parser'

import { toNumber } from './types'

const toGenre = ($data: Prism<any>) => {
  return {
    id: $data.get<string>('key').transform(toNumber).value,
    title: $data.get<string>('title').value,
  }
}

const toGenreContainer = ($data: Prism<any>) => {
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

const parseGenreContainer = createParser('genreContainer', toGenreContainer)

export { toGenre, toGenreContainer, parseGenreContainer }
