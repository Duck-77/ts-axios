import { AxiosPromise, AxiosRequestConfig, Method, NoUrlRequestConfig } from '../types'
import dispathRequest from './dispatch'

class Axios {
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispathRequest(config)
  }

  get(url: string, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_without_data('get', url, config)
  }

  delete(url: string, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_without_data('delete', url, config)
  }

  head(url: string, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_without_data('head', url, config)
  }

  options(url: string, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_without_data('options', url, config)
  }

  post(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_with_data('post', url, data, config)
  }

  put(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_with_data('put', url, data, config)
  }

  patch(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise {
    return this._request_with_data('patch', url, data, config)
  }

  _request_without_data(method: Method, url: string, config?: NoUrlRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url }))
  }

  _request_with_data(method: Method, url: string, data?: any, config?: NoUrlRequestConfig) {
    return this.request(Object.assign(config || {}, { method, url, data }))
  }
}

export default Axios
