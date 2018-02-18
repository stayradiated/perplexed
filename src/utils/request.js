import xml2js from 'xml2js'
import fetch from 'isomorphic-fetch'
import { promisify } from 'util'

import { withParams } from './params'

const parseXMLString = promisify(xml2js.parseString)

// delete undefined headers
// mutates the object
export function cleanHeaders (headers = {}) {
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) {
      delete headers[key]
    }
  })
  return headers
}

export async function request (url, options = {}) {
  const { params, ...otherOptions } = options
  const urlWithParams = withParams(url, params)
  cleanHeaders(otherOptions.headers)
  const res = await fetch(urlWithParams, otherOptions)
  if (res.status >= 400) {
    const error = new Error(`Request Error: ${res.status}`)
    error.response = res
    throw error
  }
  return res
}

export async function requestJSON (url, options = {}) {
  let res = null
  try {
    res = await request(url, {
      ...options,
      headers: {
        ...options.headers,
        accept: 'application/json'
      }
    })
  } catch (error) {
    if (error.response != null) {
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

export async function requestXML (url, options) {
  const res = await request(url, options)
  const text = await res.text()
  const xml = await parseXMLString(text)
  return xml
}
