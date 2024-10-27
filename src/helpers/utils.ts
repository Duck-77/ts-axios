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
  return isObject(value) && Object.prototype.toString.call(value) === `[object Object]`
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

/**
 * 深度合并多个对象，后面对象的属性覆盖前面的
 * @param objects 合并对象的集合
 */
export function deepMerge<T extends Record<string, any>>(...objectArray: T[]): T {
  const result = Object.create(null)

  for (const object of objectArray) {
    // 遍历第n个对象
    if (object) {
      Object.keys(object).forEach((key) => {
        const curValue = object[key]
        if (isPlainObject(curValue)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], curValue)
          } else {
            result[key] = deepMerge(curValue)
          }
        } else {
          result[key] = curValue
        }
      })
    }
  }
  return result
}
