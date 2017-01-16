import {withParams} from './utils/params'
import {request, requestJSON} from './utils/request'

/**
 * A connection to a Plex server
 *
 * @class ServerConnection
 * @param {string} uri
 * @param {Account|Client} parent
 */

export default class ServerConnection {
  constructor (uri, parent) {
    this.uri = uri
    this.parent = parent
  }

  /**
   * Get headers
   */

  headers () {
    return this.parent && this.parent.headers()
  }


  /**
   * Given a path, return a fully qualified URL
   *
   * @params {string} path
   * @returns {string}
   */

  getUrl (path, params) {
    return withParams(this.uri + path, params)
  }

  /**
   * Given a path, return a fully qualified URL
   * Includes the X-Plex-Token parameter in the URL
   *
   * @params {string} path
   * @returns {string}
   */

  getAuthenticatedUrl (path, params) {
    return this.getUrl(path, {
      ...params,
      'X-Plex-Token': this.headers()['X-Plex-Token'],
    })
  }

  /**
   * Fetch a path on this server. Resolves with the Response object.
   *
   * @param {string} path
   * @param {Object] [options={}]
   * @returns {Promise}
   */

  fetch (path, options = {}) {
    const url = this.getUrl(path)
    return request(url, {
      ...options,
      headers: {
        ...this.headers(),
        ...options.headers,
      },
    })
  }

  /**
   * Fetch a path on this server as JSON.
   *
   * @param {string} path
   * @param {Object] [options={}]
   * @returns {Promise}
   */

  fetchJSON (path, options = {}) {
    const url = this.getUrl(path)
    return requestJSON(url, {
      ...options,
      headers: {
        ...this.headers(),
        ...options.headers,
      },
    })
  }
}
