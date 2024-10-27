import { AxiosInterceptorManager } from './interceptor'
import { MyOmit, MyPartial } from './utils'

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

type AxiosHeaderValue = string | string[] | number | boolean | null
type RawRequestHeaders = { [key: string]: AxiosHeaderValue }
type RequestHeadersList =
  | 'Accept'
  | 'Content-Length'
  | 'User-Agent'
  | 'Content-Encoding'
  | 'Authorization'
type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'mutipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

type RequestHeaders = MyPartial<
  RawRequestHeaders & {
    [key in RequestHeadersList]?: AxiosHeaderValue
  } & { 'Content-Type': ContentType }
>

export interface IntervalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: RequestHeaders
}

/**
 * Axios请求配置
 */
export interface AxiosRequestConfig<D = any> {
  url: string
  method?: Method
  data?: D
  params?: any
  headers?: RequestHeaders
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

/**
 * Axios响应类型
 */
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

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
 * Axios实例属性
 */
export interface Axios {
  interceptors: {
    request: AxiosInterceptorManager<IntervalAxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: NoUrlRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: NoUrlRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: NoUrlRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: NoUrlRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: NoUrlRequestConfig): AxiosPromise<T>
}

/**
 * Axios实例接口
 */
export interface AxiosInstance extends Axios {
  /// 函数重载,两种传递参数的方式
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
