import xml2js from 'xml2js'
import { promisify } from 'util'
import ky, { Options as KyOptions } from 'ky-universal'

import { Params } from './params'

export interface RequestOptions extends KyOptions {
  searchParams?: Params,
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
  cleanHeaders(options.headers as Record<string, string>)
  return ky(url, options)
}

const requestJSON = async (url: string, options: RequestOptions = {}) => {
  const res = await request(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json',
    },
  })
  return res.json()
}

const requestXML = async (url: string, options: RequestOptions) => {
  const res = await request(url, options)
  const text = await res.text()
  const xml = await parseXMLString(text)
  return xml
}

export { request, requestJSON, requestXML }
