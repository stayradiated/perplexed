/**
 * Handle container params.
 *
 * @private
 * @params {Object} [options={}]
 * @returns {Object}
 */

export function withContainerParams (options = {}) {
  const {start, size, ...params} = options
  if (typeof size === 'number') {
    params['X-Plex-Container-Size'] = size.toString()
    params['X-Plex-Container-Start'] = (typeof start === 'number' ? start.toString() : '0')
  }
  return params
}

