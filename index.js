const PlexAPI = require('plex-api')

const config = require('./config.json')

const client = new PlexAPI(config.server)

function getRoot () {
  return client.query('/')
}

function getSections () {
  return client.query('/library/sections')
}

function getSection () {
  return client.query('/library/sections/1')
}

function getAlbums () {
  return client.query({
    uri: '/library/sections/1/albums',
    extraHeaders: {
      'X-Plex-Container-Size': '3',
      'X-Plex-Container-Start': '0',
    },
  })
}

function filter () {
  return client.query('/library/sections/1/albums?year=2016')
}

function search (query) {
  return client.query(`/library/sections/1/search?type=10&query=${query}`)
}

getAlbums()
  .then((result) => {
    // array of children, such as Directory or Server items
    // will have the .uri-property attached
    console.log(JSON.stringify(result, null, 2))
  })
  .catch((err) => {
    console.error(err)
  })

module.exprots = {
  getRoot,
  getSections,
  getSection,
  getAlbums,
  filter,
  search,
}
