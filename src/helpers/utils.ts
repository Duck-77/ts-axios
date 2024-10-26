function isDate(value: any): value is Date {
  return Object.prototype.toString.call(value) === '[Object Date]'
}

function isObject(value: any): value is Object {
  return value !== null && typeof value === 'object'
}

function isPlainObject(value: any): value is Object {
  return Object.prototype.toString.call(value) === `[object Object]`
}

export { isDate, isObject, isPlainObject }
