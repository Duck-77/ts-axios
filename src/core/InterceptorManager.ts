import { AxiosPromise, AxiosRequestConfig } from '../types'

/**
 * 每一个拦截器拥有一个负责配置和错误处理的属性
 */
export interface Interceptor<T> {
  onFullfilled?: ((value: T) => T | Promise<T>) | ((config: AxiosRequestConfig) => AxiosPromise) | null
  onRejected?: ((error: any) => any) | null
}

/** 拦截器管理类 */
export default class InterceptorManager<T> {
  private interceptors: (Interceptor<T> | null)[]

  constructor() {
    this.interceptors = []
  }

  /**
   * 添加拦截器
   * @param onFullfilled 拦截器配置
   * @param onRejected 错误捕获
   * @returns
   */
  use(onFullfilled?: ((value: T) => T | Promise<T>) | null, onRejected?: ((error: any) => any) | null): number {
    const interceptor = { onFullfilled, onRejected }
    this.interceptors.push(interceptor)
    return this.interceptors.length - 1
  }

  /**
   * 删除拦截器
   * @param id 拦截器的id
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  /**
   * 遍历拦截器管理
   * @param callback 用于接收interceptor的回调
   */
  forEach(callback: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor) {
        callback(interceptor)
      }
    })
  }
}
