import { AxiosRequestConfig, AxiosResponse } from '../types'

class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string
  request?: XMLHttpRequest
  response?: AxiosResponse

  /* istanbul ignore next */
  constructor(message: string, config: AxiosRequestConfig, code?: string, request?: XMLHttpRequest, response?: AxiosResponse) {
    super(message)
    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    /** When super is called in TS, this points to the problem */
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
