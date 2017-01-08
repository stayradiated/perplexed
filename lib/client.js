import uuid from 'uuid'
import os from 'os'

/**
 * A Plex API client
 *
 * @class Client
 * @param {Object} options
 * @param {string} options.identifier
 * @param {string} options.product
 * @param {string} options.version
 * @param {string} options.device
 * @param {string} options.deviceName
 * @param {string} options.platform
 * @param {string} options.platformVersion
 */

export default class Client {
  constructor (options = {}) {
    this.identifier      = options.identifier || uuid.v4()
    this.product         = options.product || 'Node.js App'
    this.version         = options.version || '1.0.0'
    this.device          = options.device || os.platform()
    this.deviceName      = options.deviceName || 'Node.js App'
    this.platform        = options.platform || 'Node.js'
    this.platformVersion = options.platformVersion || process.version
  }

  /**
   * All the headers that let Plex know which device is making the request
   *
   * @private
   * @returns {Object}
   */

  headers () {
    return {
      'X-Plex-Client-Identifier': this.identifier,
      'X-Plex-Product': this.product,
      'X-Plex-Version': this.version,
      'X-Plex-Device': this.device,
      'X-Plex-Device-Name': this.deviceName,
      'X-Plex-Platform': this.platform,
      'X-Plex-Platform-Version': this.platformVersion,
      'X-Plex-Provides': 'controller',
    }
  }
}
