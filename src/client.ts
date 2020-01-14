import uuid from 'uuid'
import os from 'os'

interface ClientOptions {
  device?: string,
  deviceName?: string,
  identifier?: string,
  platform?: string,
  platformVersion?: string,
  product?: string,
  version?: string,
}

/**
 * A Plex API client
 *
 * @class Client
 * @param {Object} options
 * @param {string} options.device
 * @param {string} options.deviceName
 * @param {string} options.identifier
 * @param {string} options.platform
 * @param {string} options.platformVersion
 * @param {string} options.product
 * @param {string} options.version
 */

export default class Client {
  public device: string
  public deviceName: string
  public identifier: string
  public platform: string
  public platformVersion: string
  public product: string
  public version: string

  constructor (options: ClientOptions = {}) {
    this.device = options.device || os.platform()
    this.deviceName = options.deviceName || 'Node.js App'
    this.identifier = options.identifier || uuid.v4()
    this.platform = options.platform || 'Node.js'
    this.platformVersion = options.platformVersion || process.version
    this.product = options.product || 'Node.js App'
    this.version = options.version || '1.0.0'
  }

  /**
   * All the headers that let Plex know which device is making the request
   *
   * @private
   * @returns {Object}
   */

  headers (): Record<string, string> {
    return {
      'X-Plex-Client-Identifier': this.identifier,
      'X-Plex-Device': this.device,
      'X-Plex-Device-Name': this.deviceName,
      'X-Plex-Platform': this.platform,
      'X-Plex-Platform-Version': this.platformVersion,
      'X-Plex-Product': this.product,
      'X-Plex-Provides': 'controller',
      'X-Plex-Version': this.version,
    }
  }
}
