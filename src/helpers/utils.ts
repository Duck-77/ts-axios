/**
 * Determine if a value is of Date type
 * @param from
 * @param to
 */
export function isDate(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === '[object Date]'
}

/**
 * Determine if a value is of common Object type
 * @param from
 * @param to
 */
export function isObject(value: unknown): value is Object {
  return value !== null && typeof value === 'object'
}

/**
 * Determine if a value is of plain Object type
 * @param from
 * @param to
 */
export function isPlainObject(value: unknown): value is Object {
  return isObject(value) && Object.prototype.toString.call(value) === `[object Object]`
}

/**
 * Determine if a value is of FormData type
 * @param value
 * @returns
 */
export function isFormData(value: unknown): value is FormData {
  return typeof value !== 'undefined' && value instanceof FormData
}

/**
 * Determine if a value is of URLSearchParams type
 * @param value
 * @returns
 */
export function isURLSearchParams(value: unknown): value is URLSearchParams {
  return typeof value !== 'undefined' && value instanceof URLSearchParams
}

/**
 * Copy the properties and methods from 'from' to 'to'
 * @param from - from object
 * @param to - to object
 */
export function extend<T, U>(from: T, to: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = (from as any)[key]
  }
  return to as T & U
}

/**
 * Deeply merge multiple objects
 * @param objectArray collection of objects
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
