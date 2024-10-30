import {
  AxiosDefaults,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  IntervalAxiosRequestConfig,
  Method,
} from '../types'
import dispatchRequest, { transformUrl } from './dispatch'
import InterceptorManager, { Interceptor } from './InterceptorManager'
import configMerge from './merge'

/**
 * 拦截器调用链的类型
 */
type InterceptorChain<T> = Interceptor<T>[]

class Axios {
  constructor(defaultConfig: AxiosDefaults) {
    this.defaults = defaultConfig
    /**
     * 初始化拦截器对象
     */
    this.interceptors = {
      request: new InterceptorManager<IntervalAxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    }
  }

  defaults: AxiosDefaults

  // 拦截器对象
  interceptors: {
    request: InterceptorManager<IntervalAxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  // 参数部分这里无需关心,因为instance还是AxiosInstance接口类型,会根据传递参数数量自动匹配参数类型
  request<T>(url: any, config?: any): AxiosPromise<T> {
    // 如果第一个参数为string类型,说明传递了url
    if (typeof url === 'string') {
      if (!config) {
        config = { url }
      }
    } else {
      // 传递了第一个参数,但是不为string类型,说明此时传递的是config
      config = url
    }

    // 合并默认配置与实例配置
    config = configMerge(this.defaults, config)

    // 这里处理拦截器链式调用的问题

    /// 拦截器调用链
    const interceptorChain: InterceptorChain<any> = [
      {
        onFullfilled: dispatchRequest,
        onRejected: undefined,
      },
    ]

    /// 将request拦截器按倒序的方式添加到调用链
    this.interceptors.request.forEach((interceptor) => {
      interceptorChain.unshift(interceptor)
    })

    /// 将response拦截器按顺序的方式添加到调用链
    this.interceptors.response.forEach((interceptor) => {
      interceptorChain.push(interceptor)
    })

    /// 利用promise的链式调用处理拦截器的链式调用
    let promise = Promise.resolve(config)

    while (interceptorChain.length) {
      /// 这里编译器认为shift()的结果可能为null或者PromiseChain，需要使用！断言
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
    return transformUrl(config)
  }

  private _request_without_data(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  private _request_with_data(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}

export default Axios
