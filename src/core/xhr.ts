import cookie from '../helpers/cookie'
import { transformResponse } from '../helpers/data'
import { createAxiosError } from '../helpers/error'
import { parseResponseHeaders } from '../helpers/headers'
import { isSameOriginURL } from '../helpers/url'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'

function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url = '',
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus,
    } = config

    const request = new XMLHttpRequest()

    /** 请求方法（大写）,请求地址，是否异步 */
    request.open(method.toUpperCase(), url, true)

    /** 设置XSRF-TOKEN */
    if ((withCredentials || isSameOriginURL(url)) && xsrfCookieName) {
      const CookieValue = cookie.read(xsrfCookieName)
      if (xsrfHeaderName && CookieValue) {
        headers[xsrfHeaderName] = CookieValue
      }
    }

    /** 设置请求头 */

    if (auth) {
      headers['Authorization'] = `Basic ${btoa(auth.username + ':' + auth.password)}`
    }

    Object.keys(headers).forEach((name) => {
      request.setRequestHeader(name, headers[name] as string)
    })

    /** 允许跨域携带cookie */
    if (withCredentials) {
      request.withCredentials = withCredentials
    }

    /** 设置responseType */
    if (responseType) {
      request.responseType = responseType
    }

    const handleResponseResolve = (response: AxiosResponse): void => {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(createAxiosError(`Request failed with status code: ${response.status}`, config, 'REQUEST ERROR', request, response))
      }
    }

    /** 处理响应 */
    request.onreadystatechange = () => {
      // redayState !== 4
      if (request.readyState !== XMLHttpRequest.DONE) {
        return
      }

      /** 发生网络错误或者超时错误时，status为0 */
      if (request.status === 0) {
        return
      }

      /** 获取响应头 并进行格式的转化（JSON字符串转对象） */
      const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders())
      /** 获取响应数据 并进行格式的转化（JSON字符串转对象） */
      let responseData = request.responseType !== 'text' ? request.response : request.responseText
      responseData = transformResponse(responseData)
      /** 获取状态码以及状态信息 */
      const { status, statusText } = request
      /** 设置Promise完成时数据 */
      const response: AxiosResponse = {
        headers: responseHeaders,
        data: responseData,
        status,
        statusText,
        config,
        request,
      }

      /** 完成Promise */
      handleResponseResolve(response)
    }

    /** 进度监控 */
    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }

    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    }

    /** 设置请求超时时间 */
    if (timeout) {
      request.timeout = timeout
    }

    /** 处理请求失败错误 */
    request.onerror = function handleNetworkError() {
      reject(createAxiosError('Network Error', config, '', request))
    }

    /** 处理请求超时错误 */
    request.ontimeout = function handleTimeoutError() {
      reject(createAxiosError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED', request))
    }

    /** 发送请求前先检测有没有取消请求 */
    if (cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort()
        reject(reason)
      })
    }

    /** 发送请求 */
    request.send(data)
  })
}

export { xhr as default }
