import { AxiosRequestConfig, AxiosResponse } from '../types'

class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string
  request?: XMLHttpRequest
  response?: AxiosResponse

  constructor(message: string, config: AxiosRequestConfig, code?: string, request?: XMLHttpRequest, response?: AxiosResponse) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // 处理TS中调用super时，this指向上出问题的情况
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createAxiosError(
  message: string,
  config: AxiosRequestConfig,
  code?: string,
  request?: XMLHttpRequest,
  response?: AxiosResponse,
): AxiosError {
  return new AxiosError(message, config, code, request, response)
}

export { AxiosError, AxiosError as default }
