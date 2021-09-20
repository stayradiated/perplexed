import Client from './client'

import { requestJSON, requestXML, RequestOptions } from './utils/request'
import { parseResourceContainer } from './types/resources'
import { parseUser } from './types/user'
import { parsePin } from './types/pin'
import { parseDeviceList } from './types/device'
import { parseSyncList } from './types/sync-list'

const PLEX_API = 'https://plex.tv'

/**
 * A plex.tv account
 *
 * @class Account
 * @param {string} [authToken] Plex auth token
 */

export default class Account {
  public client: Client
  public authToken: string

  constructor (client: Client, authToken?: string) {
    this.client = client
    this.authToken = authToken
  }

  /**
   * Headers we need to send to Plex whenever we make a request
   *
   * @private
   */

  headers (): Record<string, string> {
    return {
      ...this.client.headers(),
      'X-Plex-Token': this.authToken || undefined,
    }
  }

  /**
   * Make a JSON request to the Plex.tv API
   *
   * @private
   */

  fetch (path: string, options: RequestOptions = {}) {
    const url = PLEX_API + path
    return requestJSON(url, {
      ...options,
      headers: {
        ...options.headers,
        ...this.headers(),
      },
    })
  }

  /**
   * Make an XML request to the Plex.tv API
   *
   * @private
   */

  fetchXML (path: string, options: RequestOptions = {}) {
    const url = PLEX_API + path
    return requestXML(url, {
      ...options,
      headers: {
        ...options.headers,
        ...this.headers(),
      },
    })
  }

  /**
   * Log in to a Plex account
   *
   * @param {string} username
   * @param {string} password
   * @param {string} code - Two-factor authentication code
   * @returns {Promise} - User info
   */

  async authenticate (username: string, password: string, code?: string) {
    const formData = new URLSearchParams()
    formData.append('login', username)
    formData.append('password', password)
    formData.append('rememberMe', 'true')
    if (code) formData.append('verificationCode', code)

    // we use requestJSON instead of this.fetch because if you send
    // the X-Plex-Token header it won't actually switch accounts.
    const res = await requestJSON(`${PLEX_API}/api/v2/users/signin`, {
      method: 'POST',
      headers: {
        ...this.client.headers(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    })

    const user = await parseUser(res)

    this.authToken = user.authToken
    return user
  }

  async requestPin () {
    const res = await this.fetch('/pins.json', { method: 'POST' })
    const pin = parsePin(res)
    return pin
  }

  async checkPin (pinId: string) {
    const res = await this.fetch(`/pins/${pinId}.json`)
    const pin = parsePin(res)
    if (pin.authToken != null) {
      this.authToken = pin.authToken
    }
    return pin
  }

  /**
   * Fetch information about the currently logged in user
   *
   * @returns {Promise}
   */

  async info () {
    const res = await this.fetch('/api/v2/user')
    return parseUser(res)
  }

  /**
   * Fetch a list of servers and clients connected to this plex account.
   * Useful for figuring out which server to connect to.
   *
   * Note: this API doesn't support JSON at the moment, so we need
   * to parse the response as XML.
   *
   * @returns {Promise}
   */

  async resources () {
    const res = await this.fetchXML('/api/resources', {
      searchParams: {
        includeHttps: '1',
        includeRelay: '1',
      },
    })
    return parseResourceContainer(res)
  }

  /**
   * Fetch a list of all the servers
   *
   * @returns {Promise}
   */

  async servers () {
    const resources = await this.resources()
    return {
      ...resources,
      devices: resources.devices.filter((device) =>
        device.provides.includes('server'),
      ),
    }
  }

  /**
   * Fetch a list of devices attached to an account
   *
   * @returns {Promise}
   */

  async devices () {
    const res = await this.fetchXML('/devices.xml')
    return parseDeviceList(res)
  }

  /**
   * Remove a device from the account
   */

  async removeDevice (deviceId: string) {
    await this.fetch(`/devices/${deviceId}.json`, {
      method: 'DELETE',
    })
    return true
  }

  /**
   * Fetch a list of items that are syncing to a device
   */

  async syncItems (deviceId: string) {
    const res = await this.fetchXML(`/devices/${deviceId}/sync_items`)
    return parseSyncList(res)
  }

  /**
   * Remove an item from the sync list
   */

  async removeSyncItem (deviceId: string, syncItemId: string) {
    await this.fetch(`/devices/${deviceId}/sync_items/${syncItemId}`, {
      method: 'DELETE',
    })
    return true
  }
}
