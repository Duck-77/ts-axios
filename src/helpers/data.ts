import { isObject, isPlainObject } from './utils'

/**
 * 转换请求时的data，因为xhr支持很多对象类型
 * @param data
 * @returns
 */
function tranformRequest(data: any): any {
  if (isObject(data) && isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 转化响应中的data，默认情况下，它为json字符串，虽然可以通过为xhr设置responseType=json去转换，但是默认都不会去传递这个参数
 * @param data
 * @returns
 */
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
