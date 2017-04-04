import xml2js from 'xml2js'
import promisify from 'es6-promisify'
import fetch from 'isomorphic-fetch'

import {withParams} from './params'

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

export function request (url, options = {}) {
  const {params, ...otherOptions} = options
  const urlWithParams = withParams(url, params)
  cleanHeaders(otherOptions.headers)
  return fetch(urlWithParams, otherOptions)
    .then((res) => {
      if (res.status >= 400) {
        const error = new Error(`Request Error: ${res.status}`)
        error.response = res
        throw error
      }
      return res
    })
}

export function requestJSON (url, options = {}) {
  return request(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json',
    },
  })
    .then(
      (res) => res.json().catch(() => res),
      (error) => {
        if (error.response != null) {
          return error.response.json().then((json) => {
            error.response = json
            throw error
          })
        }
        throw error
      })
}

export function requestXML (url, options) {
  return request(url, options)
    .then((res) => res.text())
    .then((res) => parseXMLString(res))
}
