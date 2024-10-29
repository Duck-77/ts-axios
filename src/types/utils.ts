/**
 * 使T中所有的属性都是可选的
 */
export type MyPartial<T> = {
  [p in keyof T]?: T[p]
}

/**
 * 如果T中存在K属性则返回never，否则返回T
 */
export type MyExclude<T, K> = K extends T ? never : T

/**
 * 将K中T类型定义中去除
 */
export type MyOmit<T, K extends keyof T> = {
  [P in MyExclude<keyof T, K>]: T[P]
}
