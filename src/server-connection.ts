import { Params, withParams } from './utils/params'
import { RequestOptions, requestJSON } from './utils/request'

interface Parent {
  headers: () => Record<string, string>,
}

/**
 * A connection to a Plex server
 */

export default class ServerConnection {
  public uri: string
  public parent: Parent

  constructor (uri: string, parent?: Parent) {
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
   */

  getUrl (path: string, params: Params = {}) {
    return withParams(this.uri + path, params)
  }

  /**
   * Given a path, return a fully qualified URL
   * Includes the X-Plex-Token parameter in the URL
   */

  getAuthenticatedUrl (path: string, params: Params = {}) {
    return this.getUrl(path, {
      ...params,
      'X-Plex-Token': this.headers()['X-Plex-Token'],
    })
  }

  /**
   * Fetch a path on this server as JSON. If the response is not JSON, it will
   * return a promise of the response.
   */

  fetch (path: string, options: RequestOptions = {}) {
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
