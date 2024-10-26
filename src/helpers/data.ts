import { isObject, isPlainObject } from './utils'

function tranformRequest(data: any): any {
  if (isObject(data) && isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

function tranformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // TODO
    }
  }
  return data
}

export { tranformRequest, tranformResponse }
