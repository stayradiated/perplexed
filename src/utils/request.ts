import xml2js from 'xml2js'
import fetch from 'isomorphic-fetch'
import { promisify } from 'util'

import { Params, withParams } from './params'

export interface RequestOptions extends RequestInit {
  params?: Params,
}

class RequestError extends Error {
  public response: Response
  constructor (message: string, response: Response) {
    super(message)
    this.response = response
  }
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

const request = async (url: string, options: RequestOptions = {}) => {
  const { params, ...otherOptions } = options
  const urlWithParams = withParams(url, params)
  cleanHeaders(otherOptions.headers as Record<string, string>)
  const res = await fetch(urlWithParams, otherOptions)
  if (res.status >= 400) {
    const error = new RequestError(`Request Error: ${res.status}`, res)
    throw error
  }
  return res
}

const requestJSON = async (url: string, options: RequestOptions = {}) => {
  let res = null
  try {
    res = await request(url, {
      ...options,
      headers: {
        ...options.headers,
        accept: 'application/json',
      },
    })
  } catch (error) {
    if (error instanceof RequestError) {
      const json = await error.response.json()
      error.response = json
      throw error
    }
    throw error
  }

  try {
    const json = await res.json()
    return json
  } catch (error) {
    return res
  }
}

const requestXML = async (url: string, options: RequestOptions) => {
  const res = await request(url, options)
  const text = await res.text()
  const xml = await parseXMLString(text)
  return xml
}

export { request, requestJSON, requestXML }
