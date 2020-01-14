export type Params = Record<string, number | string | string[]>

export function withParams (url: string, params: Params = {}) {
  const paramsArray = Object.entries(params).map(([key, value]) => {
    return [key, value == null ? '' : value.toString()]
  })

  if (paramsArray.length > 0) {
    const searchParams = new URLSearchParams(paramsArray)
    return `${url}?${searchParams.toString()}`
  }
  return url
}

/**
 * Handle container params.
 *
 * @private
 * @params {Object} [options={}]
 * @returns {Object}
 */

interface WithContainerParamsOptions extends Params {
  start?: number,
  size?: number,
}

export function withContainerParams (options: WithContainerParamsOptions = {}) {
  const { start, size, ...params } = options
  if (size != null) {
    params['X-Plex-Container-Size'] = size.toString()
    params['X-Plex-Container-Start'] = start != null ? start.toString() : '0'
  }
  return params
}
