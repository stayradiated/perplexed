function parseGenre (data) {
  const {
    key = '',
    title = null
  } = data

  return {
    id: parseInt(key, 10),
    title
  }
}

export function parseGenreContainer (data) {
  if (data.MediaContainer != null) {
    data = data.MediaContainer
  }

  const {
    Directory = []
  } = data

  const genresArray = Directory.map(parseGenre)

  const genresObject = genresArray.reduce((obj, genre) => {
    obj[genre.title] = genre.id
    return obj
  }, {})

  return genresObject
}
