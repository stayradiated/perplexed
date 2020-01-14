import Prism from '@zwolf/prism'

import { createParser } from './parser'

import { toNumber } from './types'

export interface Country {
  id: number,
  title: string,
}

/**
 * @ignore
 */
const toCountry = ($data: Prism<any>): Country => {
  return {
    id: $data.get('key').transform(toNumber).value,
    title: $data.get('title').value,
  }
}

/**
 * @ignore
 */
const toCountryContainer = ($data: Prism<any>): Record<string, number> => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer')
  }

  const countriesArray = $data
    .get('Directory')
    .toArray()
    .map(toCountry)

  const countriesObject = countriesArray.reduce((obj, country) => {
    obj[country.title] = country.id
    return obj
  }, {} as Record<string, number>)

  return countriesObject
}

/**
 * @ignore
 */
const parseCountryContainer = createParser(
  'countryContainer',
  toCountryContainer,
)

export { parseCountryContainer }
