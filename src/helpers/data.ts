import { AxiosResponse } from '../types'
import { isObject, isPlainObject } from './utils'

/**
 * Convert the object type in the request body data to JSON type
 * @param data
 * @returns
 */
function transformRequest(data: any): any {
  if (isObject(data) && isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * Convert JSON in response body to object type
 * @param data
 * @returns
 */
function transformResponse(data: any, response?: AxiosResponse): AxiosResponse {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // TODO
    }
  }
  if (response) {
    response.data = data
    return response
  }
  return data
}

export { transformRequest, transformResponse }
