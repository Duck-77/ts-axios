import { tranformResponse } from './helpers/data'
import { parseResponseHanders } from './helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers = {}, responseType, timeout } = config

    const request = new XMLHttpRequest()

    // 请求方法（大写）,请求地址，是否异步
    request.open(method.toUpperCase(), url, true)

    // 设置请求头
    Object.keys(headers).forEach(name => {
      request.setRequestHeader(name, headers[name])
    })

    // 设置responseType
    if (responseType) {
      request.responseType = responseType
    }

    const handleResponseResolve = (response: AxiosResponse): void => {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(new Error(`request failed with status code: ${response.status}`))
      }
    }

    // 处理响应
    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return
      }

      /// 发生网络错误或者超时错误时，status为0
      if (request.status === 0) {
        return
      }

      /// 获取响应头 并进行格式的转化（JSON字符串转对象）
      const responseHeaders = parseResponseHanders(request.getAllResponseHeaders())
      /// 获取响应数据 并进行格式的转化（JSON字符串转对象）
      let responseData = request.responseType !== 'text' ? request.response : request.responseText
      responseData = tranformResponse(responseData)
      /// 获取状态码以及状态信息
      const { status, statusText } = request
      /// 设置Promise完成时数据
      const response: AxiosResponse = {
        headers: responseHeaders,
        data: responseData,
        status,
        statusText,
        config,
        request
      }

      /// 完成Promise
      handleResponseResolve(response)
    }

    // 设置请求超时时间
    if (timeout) {
      request.timeout = timeout
    }

    // 处理请求失败错误
    request.onerror = function handleNetworkError() {
      reject(new Error('network error'))
    }

    // 处理请求超时错误
    request.ontimeout = function handleTimeoutError() {
      reject(new Error(`timeout of ${timeout} ms exceeded`))
    }

    // 发送请求
    request.send(data)
  })
}

export { xhr as default }