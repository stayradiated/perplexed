function parseCountry (data) {
  const {
    key = '',
    title = null
  } = data

  return {
    id: parseInt(key, 10),
    title
  }
}

export function parseCountryContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    Directory = []
  } = data

  const countriesArray = Directory.map(parseCountry)

  const countriesObject = countriesArray.reduce((obj, country) => {
    obj[country.title] = country.id
    return obj
  }, {})

  return countriesObject
}
