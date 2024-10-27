/**
 * 判断一个值是日期类型
 * @param from
 * @param to
 */
export function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[Object Date]'
}

/**
 * 判断一个值是对象类型
 * @param from
 * @param to
 */
export function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object'
}

/**
 * 判断一个值是纯对象类型
 * @param from
 * @param to
 */
export function isPlainObject(value: any): value is Object {
  return Object.prototype.toString.call(value) === `[object Object]`
}

/**
 * 将from中的属性和方法拷贝到to中
 * @param from
 * @param to
 */
export function extend<T, U>(from: T, to: U): T & U {
  for (const k in from) {
    ;(to as T & U)[k] = from[k] as any
  }
  return to as T & U
}
