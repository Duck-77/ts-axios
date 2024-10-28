/**
 * CancelToken实例类型
 */
export interface CancelToken {
  promise: Promise<Cancel>
  /**
   * 作为成功时调回的参数
   */
  reason?: Cancel

  repeatRequest(): void
}

/**
 * cancel方法的类型
 */
export interface Canceler {
  (message?: string): void
}

/**
 * 传入CancelToken类构造函数的回调函数
 */
export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

/**
 * CancelToken的类类型(包含它的构造函数定义和静态方法定义)
 */
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

/**
 * Cancel类，请求取消类：承载取消信息
 */
export interface Cancel {
  message?: string
}

/**
 * Cancel的类类型
 */
export interface CancelStatic {
  new (message?: string): Cancel
}
