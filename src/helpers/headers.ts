import { noDataMethods, useDataMethods } from '../default'
import { deepMerge, isFormData, isPlainObject } from './utils'

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
  // 规范请求头：首字母大写
  normalizeHeadersName(headers, 'Content-Type')

  // 当传入的值为原始对象类型时，进行headers处理
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  } else if (data === null && headers['Content-Type']) {
    delete headers['Content-Type']
  } else if (isFormData(data)) {
    /** 下面这一行不要手动添加，浏览器会自动识别上传内容并自动添加multipart/form-data请求头和很关键的的boundary */
    // headers['Content-Type'] = 'multipart/form-data;'
    delete headers['Content-Type']
  }
  return headers
}

/**
 * 将原生响应字符串转化为键值对对象
 * @param headers 响应头
 * @returns 响应头的键值对
 */
function parseResponseHeaders(headers: string): { [key: string]: any } {
  if (!headers) {
    return {}
  }
  let result: { [key: string]: any } = {}
  const sentence = headers.split('\r\n')
  sentence.forEach((item) => {
    const [key, ...values] = item.split(':')
    /** 上面的value中可能存在:,这样就会被分割成多个values */
    const value = values.join(':')
    if (key && value) {
      result[key.trim()] = value.trim()
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
  /** 忽略method的大小写，将配置中大写的和小写的都合并，最终取出，最后将配置中的大小写默认配置都删除 */
  headers = deepMerge(headers.common, headers[method.toUpperCase()], headers[method.toLowerCase()], headers)

  /** 扁平后删除所有defualt中添加的请求头中的方法：包括 大写，小写，以及common */
  const lowerCaseDeleteMethods = [...useDataMethods, ...noDataMethods]
  const upperCaseDeleteMethods = lowerCaseDeleteMethods.reduce<string[]>((pre, cur) => {
    return [...pre, cur.toUpperCase()]
  }, [])

  const deleteMethods = [...lowerCaseDeleteMethods, ...upperCaseDeleteMethods, 'common']
  for (const m of deleteMethods) {
    delete headers[m]
  }
  return headers
}

export { buildHeaders, buildHeaders as default, parseResponseHeaders, flattenHeaders }
