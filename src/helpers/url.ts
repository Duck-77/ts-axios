import { isDate, isPlainObject, isURLSearchParams } from './utils'

/**
 * 将传入的字符串进行编码,安全传输,但是将特殊字符的转化还原
 * @param value 将要编码的字符串
 * @returns
 */
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

/**
 * 拼接url与params并经过特殊处理成为完整的接口地址
 * @param url Axios配置的url
 * @param params Axios配置的params参数
 * @returns
 */
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    /**
     * 1.排除为空的params参数
     * 2.处理params参数为数组的情况
     * 3.
     */
    Object.keys(params).forEach((key) => {
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

      values.forEach((param) => {
        /**
         * 1.如果是日期类型,需要转化为toISOString
         * 2.如果是纯对象类型,则转化为JSON字符串
         * 3.处理key和value的转义并原话为原始传入的参数key和value
         */
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

    /**
     * 1.将key和value拼接的值数组进行拼接
     * 2.去掉路径中的hash符号#
     * 3.保留url中之前的参数值,如果有则添加&没有则是?
     */
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

/**
 * 判断目标域与当前域是否同源
 * @param url 目标域地址
 * @returns
 */
export function isSameOriginURL(url: string): boolean {
  const targetOrigin = resovleURL(url)
  const currentOrigin = resovleURL(window.location.href)
  return targetOrigin.host === currentOrigin.host && targetOrigin.protocol === currentOrigin.protocol
}

/**
 * 获取URL中的协议和域名
 * @param url url
 * @returns /{ protocol, host }/
 */
function resovleURL(url: string): { protocol: string; host: string } {
  const TagA = document.createElement('a')
  TagA.setAttribute('href', url)
  // 利用a标签的特性和方法,拿到协议和域名
  const { protocol, host } = TagA
  return { protocol, host }
}

/**
 * 判断url是不是一个绝对路径
 * @param url
 * @returns
 */
export function isAbsolueURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

/**
 * 拼接baseURL和relativeURL
 * @param baseURL
 * @param relativeURL
 * @returns
 */
export function combineURL(baseURL: string, relativeURL?: string) {
  return relativeURL ? baseURL.replace(/\/$/, '') + '/' + relativeURL.replace(/^\//, '') : baseURL
}
