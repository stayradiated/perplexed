import xml2js from 'xml2js'
import { promisify } from 'util'
import { Options as KyOptions } from 'ky'
import ky from 'ky-universal'

import { Params } from './params'

export interface RequestOptions extends KyOptions {
  searchParams?: Params,
  headers?: Record<string, string>,
}

const parseXMLString = promisify(xml2js.parseString)

// delete undefined headers
// mutates the object
const cleanHeaders = (headers: Record<string, string> = {}) => {
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) {
      delete headers[key]
    }
  })
  return headers
}

const request = (url: string, options: RequestOptions = {}) => {
  const {
    method,
    body,
    json,
    searchParams,
    prefixUrl,
    retry,
    timeout,
    throwHttpErrors,
    headers,
  } = options

  cleanHeaders(options.headers as Record<string, string>)

  return ky(url, {
    method,
    body,
    json,
    searchParams,
    prefixUrl,
    retry,
    timeout,
    throwHttpErrors,
    hooks: {
      beforeRequest: [
        (request) => {
          Object.keys(headers).forEach((key) => {
            request.headers.set(key, headers[key])
          })
        },
      ],
    },
  })
}

const requestJSON = async (url: string, options: RequestOptions = {}) => {
  const res = await request(url, {
    timeout: 1000 * 60,
    ...options,
    headers: Object.assign({ accept: 'application/json' }, options.headers),
  })

  if (res.headers.get('content-type').includes('application/json')) {
    return res.json()
  }

  return res.text()
}

const requestXML = async (url: string, options: RequestOptions) => {
  const res = await request(url, options)
  const text = await res.text()
  const xml = await parseXMLString(text)
  return xml
}

export { request, requestJSON, requestXML }
