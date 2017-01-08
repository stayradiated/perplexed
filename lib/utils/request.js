import xml2js from 'xml2js'
import promisify from 'es6-promisify'
import qs from 'qs'
import fetch from 'isomorphic-fetch'

const parseXMLString = promisify(xml2js.parseString)

export function withParams (url, params) {
  if (params != null) {
    return `${url}?${qs.stringify(params)}`
  }
  return url
}

export function request (url, options = {}) {
  const {params, ...otherOptions} = options
  const urlWithParams = withParams(url, params)
  return fetch(urlWithParams, otherOptions)
    .then((res) => {
      if (res.status >= 400) {
        return Promise.reject(res)
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
      (res) => res.json(),
      (res) => res.json().then((json) => Promise.reject(json)))
}

export function requestXML (url, options) {
  return request(url, options)
    .then((res) => res.text())
    .then((res) => parseXMLString(res))
}
