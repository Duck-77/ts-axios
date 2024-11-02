/** 拦截器管理类 */
export interface AxiosInterceptorManager<T> {
  use(onFullfilled?: ((value: T) => T | Promise<T>) | null, onRejected?: (error: any) => any | null): number
  eject(id: number): void
}
