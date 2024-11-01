import { noDataMethods, useDataMethods } from '../default'
import { deepMerge, isFormData, isPlainObject } from './utils'

/**
 * standardize the reuqest header attribute to the specified characters
 * @param headers request headers
 * @param normalizeName standardize headers name
 * @returns
 */
function normalizeHeadersName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach((name) => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

/**
 * process request headers
 * @param headers request headers
 * @param data request data
 */
function buildHeaders(headers: any, data: any): any {
  normalizeHeadersName(headers, 'Content-Type')
  if (!headers) {
    return {}
  } else if (isPlainObject(data) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json;charset=utf-8'
  } else if (data === undefined || data === null) {
    delete headers['Content-Type']
  } else if (isFormData(data)) {
    delete headers['Content-Type']
  }
  return headers
}

/**
 * convert the navitve response string into a key value pair object
 * @param headers response headers
 * @returns pair object of response headers
 */
function parseResponseHeaders(headers: string): { [key: string]: any } {
  if (!headers) {
    return {}
  }
  let result: { [key: string]: any } = {}
  const sentence = headers.split('\r\n')
  sentence.forEach((item) => {
    const [key, ...values] = item.split(':')
    const value = values.join(':')
    if (key && value) {
      result[key.trim()] = value.trim()
    }
  })
  return result
}

/**
 * flatten the merged request headers with request method
 * @param headers merged request headers
 * @param method request method
 */
function flattenHeaders(headers: any, method: string): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method.toLowerCase()], headers)
  const deleteMethods = [...useDataMethods, ...noDataMethods, 'common']
  for (const m of deleteMethods) {
    delete headers[m]
  }
  return headers
}

export { buildHeaders, buildHeaders as default, parseResponseHeaders, flattenHeaders }
