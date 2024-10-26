import { isDate, isPlainObject } from './utils'

function encode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function buildUrl(url: string, params?: any): string {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const param = params[key]
    if (!param || param === undefined || param === null) {
      return
    }
    let values = []
    if (Array.isArray(param)) {
      values = param
      key += '[]'
    } else {
      values = [param]
    }

    values.forEach(param => {
      if (isDate(param)) {
        param = param.toISOString()
      } else if (isPlainObject(param)) {
        param = JSON.stringify(param)
      }
      const encodeKey = encode(key)
      const encodeValue = encode(param)
      parts.push(`${encodeKey}=${encodeValue}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export { buildUrl }
