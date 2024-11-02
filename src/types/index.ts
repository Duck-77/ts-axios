import { CancelStatic, CancelToken, CancelTokenStatic } from './canceltoken'
import { AxiosInterceptorManager } from './interceptor'

/** Represents HTTP request methods. */
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

/** Represents the value type of request headers. */
export type AxiosHeaderValue = string | string[] | number | boolean | null

/** Represents the request headers. */
export type RawRequestHeaders = { [key: string]: AxiosHeaderValue }

/** List of optional request headers. */
type RequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization'

/** Represents content types for request headers. */
type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

/** Represents optional request headers, combining RawRequestHeaders and specific header fields. */
export type AxiosRequestHeaders = Partial<
  RawRequestHeaders & {
    [key in RequestHeadersList]?: AxiosHeaderValue
  } & {
    'Content-Type': ContentType
  } & {
    [key: string]: any
  }
>

/** Represents the configuration for Axios requests, including headers. */
export interface IntervalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  /** The request headers to be sent with the request. */
  headers: AxiosRequestHeaders
}

/** Represents default headers used in Axios requests. */
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

/** Represents the default configuration for Axios instances. */
export interface AxiosDefaults<D = any> extends AxiosRequestConfig<D> {
  /** Default headers for requests. */
  headers: HeaderDefaults & {
    [key: string]: any
  }
}

/** Represents the configuration for Axios requests, allowing partial headers. */
export interface AxiosDefaultConfig extends AxiosRequestConfig {
  /** Optional headers for the request. */
  headers?: Partial<HeaderDefaults> & {
    [key: string]: any
  }
}

/** Type definition for a function that transforms request/response data. */
export interface AxiosTransformer {
  /** The function takes in data, headers, and response, and transforms them. */
  (data: any, headers?: any, response?: any): any
}

/** Represents basic authentication credentials. */
export interface AxiosBasicCredentials {
  /** Username for basic authentication. */
  username?: string
  /** Password for basic authentication. */
  password?: string
}

/** Represents the configuration for an Axios request. */
export interface AxiosRequestConfig<D = any> {
  /** The URL of the request. */
  url?: string
  /** The HTTP method to use for the request. */
  method?: Method
  /** The data to be sent as the request body. */
  data?: D
  /** URL parameters to be sent with the request. */
  params?: any
  /** Request headers to be sent with the request. */
  headers?: AxiosRequestHeaders
  /** The type of response data expected. */
  responseType?: XMLHttpRequestResponseType
  /** Base URL for the request. */
  baseURL?: string
  /** Timeout duration for the request. */
  timeout?: number
  /** Transform function(s) for request data. */
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  /** Transform function(s) for response data. */
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  /** Cancel token to cancel the request. */
  cancelToken?: CancelToken
  /** Whether to include credentials with the request. */
  withCredentials?: boolean
  /** Name of the cookie for CSRF protection. */
  xsrfCookieName?: string
  /** Name of the header for CSRF protection. */
  xsrfHeaderName?: string
  /** Basic authentication credentials. */
  auth?: AxiosBasicCredentials
  /** Custom validation for HTTP status codes. */
  validateStatus?: (status: number) => boolean
  /** Callback function for download progress events. */
  onDownloadProgress?: (e: ProgressEvent) => void
  /** Callback function for upload progress events. */
  onUploadProgress?: (e: ProgressEvent) => void
  /** Function to serialize URL parameters. */
  paramsSerializer?: (params: any) => string

  /** Additional properties can be added. */
  [key: string]: any
}

/** Represents the response from an Axios request. */
export interface AxiosResponse<T = any> {
  /** The data returned in the response. */
  data: T
  /** The HTTP status code of the response. */
  status: number
  /** The HTTP status text. */
  statusText: string
  /** The headers returned in the response. */
  headers: any
  /** The configuration used for the request. */
  config: AxiosRequestConfig
  /** The original request object. */
  request: any
}

/** Represents a promise that resolves to an Axios response. */
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

/** Represents an error that occurred during an Axios request. */
export interface AxiosError extends Error {
  /** Indicates whether the error is an Axios error. */
  isAxiosError: boolean
  /** The configuration for the request that caused the error. */
  config: AxiosRequestConfig
  /** Optional error code. */
  code?: string | null
  /** The original request object. */
  request?: any
  /** The response object associated with the error. */
  response?: AxiosResponse
}

/** Represents a request configuration for Axios without a URL. */
export type NoUrlRequestConfig = Omit<AxiosRequestConfig, 'url'>

/** Represents the Axios instance type, which includes default properties and methods. */
export interface Axios {
  /** The default configuration for Axios requests. */
  defaults: AxiosDefaults
  /** The interceptors for request and response. */
  interceptors: {
    request: AxiosInterceptorManager<IntervalAxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  /** Sends a request with the specified configuration. */
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a GET request. */
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a DELETE request. */
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a HEAD request. */
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends an OPTIONS request. */
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a POST request. */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a PUT request. */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Sends a PATCH request. */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  /** Returns the full URI for the request. */
  getUri(config?: AxiosRequestConfig): string
}

/** Represents an instance of Axios, with overloaded call signatures for convenience. */
export interface AxiosInstance extends Axios {
  /** Calls Axios with the specified configuration. */
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  /** Calls Axios with the specified URL and configuration. */
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

/** Represents the static properties and methods of Axios. */
export interface AxiosClassStatic {
  /** Creates a new Axios instance with the given configuration. */
  new (config: AxiosDefaultConfig): Axios
}

/** Represents the static Axios interface with methods to create instances and utilities. */
export interface AxiosStatic extends AxiosInstance {
  /** Creates a new Axios instance with custom configuration. */
  create(config?: AxiosDefaultConfig): AxiosInstance
  /** Cancel token constructor. */
  CancelToken: CancelTokenStatic
  /** Represents the Cancel object. */
  Cancel: CancelStatic
  /** Checks if the value is a cancel token. */
  isCancel: (value: any) => boolean
  /** Waits for all promises to resolve and returns their results. */
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  /** Spreads the results of an array of promises into a callback function. */
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  /** Represents the Axios class for instance creation. */
  Axios: AxiosClassStatic
}
