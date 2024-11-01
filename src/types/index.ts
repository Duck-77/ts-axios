import { CancelStatic, CancelToken, CancelTokenStatic } from './canceltoken'
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
type RequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization'
type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'mutipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

export type AxiosRequestHeaders = MyPartial<
  RawRequestHeaders & {
    [key in RequestHeadersList]?: AxiosHeaderValue
  } & {
    'Content-Type': ContentType
  } & {
    [key: string]: any
  }
>

export interface IntervalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders
}

export interface HeaderDefaults extends AxiosRequestHeaders {
  common: AxiosRequestHeaders
  get: NonNullable<AxiosRequestHeaders>
  delete: AxiosRequestHeaders
  options: AxiosRequestHeaders
  head: AxiosRequestHeaders
  post: AxiosRequestHeaders
  patch: AxiosRequestHeaders
  put: AxiosRequestHeaders
}

export interface AxiosDefaults<D = any> extends AxiosRequestConfig<D> {
  headers: HeaderDefaults & {
    [key: string]: any
  }
}

export interface AxiosDefaultConfig extends AxiosRequestConfig {
  headers?: Partial<HeaderDefaults> & {
    [key: string]: any
  }
}

export interface AxiosTransformer {
  (data: any, headers?: any, response?: any): any
}

export interface AxiosBasicCredentials {
  username?: string
  password?: string
}

/**
 * Axios请求配置
 */
export interface AxiosRequestConfig<D = any> {
  url?: string
  method?: Method
  data?: D
  params?: any
  headers?: AxiosRequestHeaders
  responseType?: XMLHttpRequestResponseType
  baseURL?: string
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
  auth?: AxiosBasicCredentials
  validateStatus?: (status: number) => boolean
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  paramsSerializer?: (params: any) => string

  [key: string]: any
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
  defaults: AxiosDefaults
  interceptors: {
    request: AxiosInterceptorManager<IntervalAxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  getUri(config?: AxiosRequestConfig): string
}

/**
 * Axios实例 & 重载
 */
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosDefaultConfig): Axios
}

/**
 *
 */
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosDefaultConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}
