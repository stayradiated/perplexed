import Prism from '@zwolf/prism'

import { createParser } from './parser'

import { toNumber } from './types'

const toCountry = ($data: Prism<any>) => {
  return {
    id: $data.get('key').transform(toNumber).value,
    title: $data.get('title').value,
  }
}

const toCountryContainer = ($data: Prism<any>) => {
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

const parseCountryContainer = createParser(
  'countryContainer',
  toCountryContainer,
)

export { parseCountryContainer }
