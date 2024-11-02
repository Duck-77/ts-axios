/**
 * A class for managing interceptors in Axios.
 * Interceptors are functions that can modify requests or responses before they are handled by `then` or `catch`.
 * This allows for the implementation of additional behavior such as logging, error handling, or modifying request/response data.
 */
export interface AxiosInterceptorManager<T> {
  /**
   * Adds an interceptor to the manager.
   * The interceptor can modify the request or response.
   *
   * @param onFullfilled - A function to handle the fulfilled state of the request/response.
   *                       This function receives the value of type T and can return a modified value or a Promise of type T.
   *                       If null, no action is taken on the fulfilled state.
   * @param onRejected - A function to handle the rejected state of the request/response.
   *                     This function receives the error object and can return a modified value or a Promise.
   *                     If null, no action is taken on the rejected state.
   * @returns The ID of the interceptor, which can be used to eject it later.
   */
  use(onFullfilled?: ((value: T) => T | Promise<T>) | null, onRejected?: (error: any) => any | null): number

  /**
   * Ejects an interceptor from the manager.
   * The interceptor can no longer modify requests or responses after being ejected.
   *
   * @param id - The ID of the interceptor to be removed.
   */
  eject(id: number): void
}
