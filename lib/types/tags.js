export function parseTags (list = []) {
  return list.map((item) => item.tag)
}

export function parseGenre (data) {
  return {
    genre: parseTags(data.Genre),
  }
}

export function parseCountry (data) {
  return {
    country: parseTags(data.Country),
  }
}
