import { AxiosPromise, AxiosRequestConfig } from '../types'

/**
 * 每一个拦截器拥有一个负责配置和错误处理的属性
 */
export interface Interceptor<T> {
  onFullfilled?:
    | ((value: T) => T | Promise<T>)
    | ((config: AxiosRequestConfig) => AxiosPromise)
    | null
  onRejected?: ((error: any) => any) | null
}

/**
 * 拦截器管理类
 */
export default class InterceptorManager<T> {
  private interceptors: (Interceptor<T> | null)[]

  constructor() {
    this.interceptors = []
  }

  /**
   * 添加拦截器的方法
   * @param onFullfilled 拦截器配置
   * @param onRejected 错误捕获
   * @returns
   */
  use(
    onFullfilled: ((value: T) => T | Promise<T>) | null,
    onRejected: ((error: any) => any) | null,
  ): number {
    const interceptor = { onFullfilled, onRejected }
    this.interceptors.push(interceptor)
    return this.interceptors.length - 1
  }

  /**
   * 删除拦截器的方法，这里不能直接从数组中删除，因为不id不能变
   * @param id 拦截器的id
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  /**
   * 遍历拦截器管理类实例，并执行callback，将遍历的拦截器传递给callback
   * @param callback 回调函数
   * @type (interceptor: Interceptor<T>) => void
   */
  forEach(callback: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor) {
        callback(interceptor)
      }
    })
  }
}
