import { AxiosDefaults, AxiosPromise, AxiosRequestConfig, AxiosResponse, IntervalAxiosRequestConfig, Method } from '../types'
import dispatchRequest, { transformURL } from './dispatch'
import InterceptorManager, { Interceptor } from './InterceptorManager'
import configMerge from './merge'

type InterceptorChain<T> = Interceptor<T>[]

class Axios {
  constructor(defaultConfig: AxiosDefaults) {
    this.defaults = defaultConfig
    this.interceptors = {
      request: new InterceptorManager<IntervalAxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    }
  }

  defaults: AxiosDefaults

  interceptors: {
    request: InterceptorManager<IntervalAxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  request<T>(url: any, config?: any): AxiosPromise<T> {
    if (typeof url === 'string') {
      if (!config) {
        config = { url }
      }
    } else {
      config = url
    }
    config = configMerge(this.defaults, config)

    const interceptorChain: InterceptorChain<any> = [
      {
        onFullfilled: dispatchRequest,
        onRejected: undefined,
      },
    ]

    this.interceptors.request.forEach((interceptor) => {
      interceptorChain.unshift(interceptor)
    })

    this.interceptors.response.forEach((interceptor) => {
      interceptorChain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (interceptorChain.length) {
      const { onFullfilled, onRejected } = interceptorChain.shift()!
      promise = promise.then(onFullfilled, onRejected)
    }

    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_without_data('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_without_data('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_without_data('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_without_data('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_with_data('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_with_data('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._request_with_data('patch', url, data, config)
  }

  getUri(config?: AxiosRequestConfig): string {
    config = configMerge(this.defaults, config)
    return transformURL(config)
  }

  private _request_without_data(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  private _request_with_data(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}

export default Axios
