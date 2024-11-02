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
      url,
      method,
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

    request.open(method!.toUpperCase(), url!, true)

    if ((withCredentials || isSameOriginURL(url!)) && xsrfCookieName) {
      const CookieValue = cookie.read(xsrfCookieName)
      if (xsrfHeaderName && CookieValue) {
        headers[xsrfHeaderName] = CookieValue
      }
    }

    /**---headers---*/
    if (auth) {
      headers['Authorization'] = `Basic ${btoa(auth.username + ':' + auth.password)}`
    }

    Object.keys(headers).forEach((name) => {
      request.setRequestHeader(name, headers[name] as string)
    })
    /**---headers---*/

    if (withCredentials) {
      request.withCredentials = withCredentials
    }

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

    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return
      }
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders())
      let responseData = responseType && request.responseType !== 'text' ? request.response : request.responseText
      responseData = transformResponse(responseData)
      const { status, statusText } = request
      const response: AxiosResponse = {
        headers: responseHeaders,
        data: responseData,
        status,
        statusText,
        config,
        request,
      }

      handleResponseResolve(response)
    }

    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress
    }

    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress
    }

    if (timeout) {
      request.timeout = timeout
    }

    /** Network Error */
    request.onerror = function handleNetworkError() {
      reject(createAxiosError('Network Error', config, '', request))
    }

    /** Timeout Error */
    request.ontimeout = function handleTimeoutError() {
      reject(createAxiosError(`Timeout of ${timeout}ms exceeded`, config, 'ECONNABORTED', request))
    }

    if (cancelToken) {
      cancelToken.promise
        .then((reason) => {
          request.abort()
          reject(reason)
        })
        .catch(
          /* istanbul ignore next */
          () => {
            //TODO
          },
        )
    }

    request.send(data)
  })
}

export { xhr as default }
