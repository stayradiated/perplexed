# Plex API Client

A wrapper around the `plex-api` package, that makes it easy to query
a plex library without having to write the HTTP requests yourself.

**Note: This only support music libraries at the moment.**

## Usage

First add the library to your project

```
$ npm install --save perplexed
```

Then create a new instance, with the same config you would pass to `plex-api`.

```javascript
const PlexClient = require('perplexed')

const client = new PlexClient('http://192.168.1.100')

client.sections().then((sections) => {
  console.log(sections)
})
```
