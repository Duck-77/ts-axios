import { AxiosRequestConfig, AxiosResponse } from '../types'

/**
 * Represents an error that occurs during an Axios request.
 * AxiosError extends the built-in Error class to provide additional
 * context for errors that occur when making HTTP requests.
 */
class AxiosError extends Error {
  /**
   * Indicates whether the error is an Axios error.
   * This property is set to true for all AxiosError instances.
   */
  isAxiosError: boolean

  /**
   * The Axios request configuration associated with the error.
   */
  config: AxiosRequestConfig

  /**
   * An optional error code associated with the error.
   * This can provide more information about the nature of the error.
   */
  code?: string

  /**
   * The XMLHttpRequest instance that generated the error, if applicable.
   */
  request?: XMLHttpRequest

  /**
   * The Axios response object received, if applicable.
   */
  response?: AxiosResponse

  /* istanbul ignore next */
  /**
   * Creates an instance of AxiosError.
   * @param message - A message describing the error.
   * @param config - The Axios request configuration that generated the error.
   * @param code - An optional error code associated with the error.
   * @param request - An optional XMLHttpRequest instance associated with the error.
   * @param response - An optional AxiosResponse object received during the error.
   */
  constructor(message: string, config: AxiosRequestConfig, code?: string, request?: XMLHttpRequest, response?: AxiosResponse) {
    super(message) // Call the parent constructor with the error message
    this.config = config // Assign the request config to the instance
    this.code = code // Assign the error code if provided
    this.request = request // Assign the request instance if provided
    this.response = response // Assign the response instance if provided
    this.isAxiosError = true // Set the AxiosError flag

    /**
     * Fix the prototype chain so instanceof works correctly.
     * This is necessary due to how TypeScript handles inheritance.
     */
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * Creates a new AxiosError instance.
 * This function is a convenience method for constructing AxiosError objects.
 * @param message - A message describing the error.
 * @param config - The Axios request configuration that generated the error.
 * @param code - An optional error code associated with the error.
 * @param request - An optional XMLHttpRequest instance associated with the error.
 * @param response - An optional AxiosResponse object received during the error.
 * @returns {AxiosError} A new instance of AxiosError.
 */
export function createAxiosError(
  message: string,
  config: AxiosRequestConfig,
  code?: string,
  request?: XMLHttpRequest,
  response?: AxiosResponse,
): AxiosError {
  return new AxiosError(message, config, code, request, response)
}

export default AxiosError
