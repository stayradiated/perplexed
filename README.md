# Plex Media Server HTTP API Client

This library makes it easier to use the Plex Media Server HTTP API.

This library was written to be used to create fully featured PMS clients, which
would allow users to login with a Plex account and select an available server.

It also provides quite a few helper methods in the `Library` class so you don't
have to manually construct the API paths yourself.

**Note: This library only support music libraries at the moment, but there is
no reason it couldn't support other library types as well.**

## Usage

First add the library to your project

```
$ yarn add perplexed
```

Then create a new client instance. This describes the client that is making the
request. You can find more about these options on [the node-plex-api
README](https://github.com/phillipj/node-plex-api).

```javascript
const {Client} = require('perplexed')

const client = new Client({
  identifier: 'f5941591-ef73-45e1-99c0-8f3a56941617',
  product: 'Node.js App',
  version: '1.0.0',
  device: 'linux',
  deviceName: 'Node.js App',
  platform: 'Node.js',
  platformVersion: '7.2.0',
})
```

Now you can create an account instance.

```javascript
const {Account} = require('perplexed')

const account = new Account(client)

account.authenticate(username, password).then(() => {
  // we now have an auth token
})
```

Now you can create an server connection.

```javascript
const {ServerConnection} = require('perplexed')

const uri = 'http://192.168.1.100:32400'
const serverConnection = new ServerConnection(uri, account)
```

Now use this connection to create a Library, which allows you to do awesome
stuff.

```javascript
const {Library} = require('perplexed')

const library = new Library(serverConnection)

// like get all the playlists in a library
library.playlists().then((playlists) => {
  // do something with playlists
})
```
