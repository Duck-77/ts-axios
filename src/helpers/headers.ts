import { noDataMethods, useDataMethods } from '../default'
import { deepMerge, isPlainObject } from './utils'

/**
 * Axios的请求头参数大小写不敏感,但是最终发送给服务器的请求头参数统一为首字母大写
 * @param headers 请求头
 * @param normalizeName 需要规范的请求头参数名
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
 * 针对于Data对Header作统一处理
 * @param headers 请求头
 * @param data 请求体
 */
function buildHeaders(headers: any, data: any): any {
  // 处理请求头参数的大小写问题
  normalizeHeadersName(headers, 'Content-Type')

  // 当传入的值为原始对象类型时，进行headers处理
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  } else if (data === null && headers['Content-Type']) {
    delete headers['Content-Type']
  }

  return headers
}

/**
 * 将原生响应字符串转化为键值对对象
 * @param headers 响应头
 * @returns 响应头的键值对
 */
function parseResponseHanders(headers: string): { [key: string]: any } {
  if (!headers) {
    return {}
  }
  let result: { [key: string]: any } = {}
  const sentence = headers.split('\r\n')
  sentence.forEach((item) => {
    const [key, value] = item.split(':')
    if (key && value) {
      result[key] = value.trim()
    }
  })
  return result
}

/**
 * 扁平化请求头，将common中的配置提取出来，并且删除没有用到的方法配置
 * @param headers 请求头
 * @param method 方法名
 */
function flattenHeaders(headers: any, method: string): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)

  const methods = [...useDataMethods, ...noDataMethods, 'common']
  for (const m of methods) {
    delete headers[m]
  }

  return headers
}

export { buildHeaders, buildHeaders as default, parseResponseHanders, flattenHeaders }
