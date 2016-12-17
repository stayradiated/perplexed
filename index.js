let config

try {
  config = require('./config.json')
} catch (err) {
  console.error('Could not load config.json')
  return
}

const Client = require('./types/Client')

const client = new Client(config.server)

client.albums()
  .then((media) => {
    media.metadata.forEach((album) => {
      album.fetchTracks().then((res) => {
        console.log(`${album.title} (${album.year}) - ${album.parentTitle}`)
        res.metadata.forEach((track) => {
          console.log(` - ${track.index}. ${track.title}`)
        })
      })
    })
  })
  .catch((err) => {
    console.error(err)
  })
