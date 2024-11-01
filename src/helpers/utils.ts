/**
 * 判断一个值是日期类型
 * @param from
 * @param to
 */
export function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * 判断一个值是对象类型
 * @param from
 * @param to
 */
export function isObject(value: unknown): value is Object {
  return value !== null && typeof value === 'object'
}

/**
 * 判断一个值是纯对象类型
 * @param from
 * @param to
 */
export function isPlainObject(value: unknown): value is Object {
  return isObject(value) && Object.prototype.toString.call(value) === `[object Object]`
}

/**
 * 判断一个值是FormData类型
 * @param value
 * @returns
 */
export function isFormData(value: unknown): value is FormData {
  return typeof value !== 'undefined' && value instanceof FormData
}

/**
 * 判断一个值是URLSearchParams类型
 * @param value
 * @returns
 */
export function isURLSearchParams(value: unknown): value is URLSearchParams {
  return typeof value !== 'undefined' && value instanceof URLSearchParams
}

/**
 * 将 from 中的属性和方法拷贝到 to 中
 * @param from - 源对象
 * @param to - 目标对象
 */
export function extend<T, U>(from: T, to: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = (from as any)[key]
  }
  return to as T & U
}

/**
 * 深度合并多个对象，后面对象的属性覆盖前面的
 * @param objectArray 合并对象的集合
 */
export function deepMerge<T extends Record<string, any> | null | undefined>(...objectArray: T[]): T {
  const result = Object.create(null)

  for (const object of objectArray) {
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
