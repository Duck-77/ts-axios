import { MyOmit } from './utils'

export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

// type AxiosHeaderValue = string | string[] | number | boolean | null

// type RequestHeadersList =
//   | 'Accept'
//   | 'Content-Length'
//   | 'User-Agent'
//   | 'Content-Encoding'
//   | 'Authorization'

/**
 * Axios请求配置
 */
export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

/**
 * Axios响应类型
 */
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

/**
 * 定义Axios错误信息
 */
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export type NoUrlRequestConfig = MyOmit<AxiosRequestConfig, 'url'>

/**
 * Axios实例方法
 */
export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise

  get(url: string, config?: NoUrlRequestConfig): AxiosPromise

  delete(url: string, config?: NoUrlRequestConfig): AxiosPromise

  head(url: string, config?: NoUrlRequestConfig): AxiosPromise

  options(url: string, config?: NoUrlRequestConfig): AxiosPromise

  post(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise

  put(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise

  patch(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise
}

/**
 * Axios实例接口
 */
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
}
