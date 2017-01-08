# Plex API Client

Query a Plex server.

**Note: This only support music libraries at the moment.**

## Usage

First add the library to your project

```
$ yarn add perplexed
```

Then create a client instance, which describes the device that is making the
request.

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

const serverConnection = new ServerConnection(url, account)
```

Now use this connection to create a Library.

```javascript
const {Library} = require('perplexed')

const library = new Library(serverConnection)
```
