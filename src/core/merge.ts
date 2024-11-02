// 合并配置
import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

// default merge strategy: return second value or value that is not null
function defaultMergeStrategy(value1: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : value1
}
// For the merging strategy of special fields: only use the following values, if the following values are empty, the merging result will be undefined
function speicalMergeStrategy(_: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : undefined
}
// Merge strategy for complex type fields
function deepMergeStrategy(value1: any, value2: any): any {
  /**
   * 1. if value2 is type of plain Object, merged value1 and value2 and return
   * 2. if value2 is not type of plain Object, reutrn value2
   * 3. if value2 is null and value1 is typeof plain Object, return value1
   * 4. else return value1 (value1 maybe null or common value)
   */
  if (isPlainObject(value2)) {
    return deepMerge(value1, value2)
  } else if (typeof value2 !== 'undefined') {
    return value2
  } else if (isPlainObject(value1)) {
    return deepMerge(value1)
  } else {
    return value1
  }
}

// Special fields
const SepicalKeys = ['url', 'data']
const DeepKeys = ['headers', 'params', 'auth']
// Assign different merging strategies based on the key
const mergeStrategy: { [key: string]: (form: any, to: any) => any } = {}
for (const key of SepicalKeys) {
  mergeStrategy[key] = speicalMergeStrategy
}
for (const key of DeepKeys) {
  mergeStrategy[key] = deepMergeStrategy
}

interface IConfigMerge {
  (config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig
}

/**
 * Merge strategy: For URL,DATA and other configurations, subsequent configurations should overwrite the previous ones
 * @param config1 first config
 * @param config2 second config
 * @returns merged config
 */
const configMerge: IConfigMerge = function (config1, config2) {
  if (!config2) {
    config2 = {}
  }

  const merged: AxiosRequestConfig = {}
  const toMerge = (key: string) => {
    const mergeFunc = mergeStrategy[key] || defaultMergeStrategy
    if (key === 'url') {
      if (!config1[key]) config1[key] = ''
      if (!config2[key]) config2[key] = ''
    }
    merged[key] = mergeFunc(config1[key], config2[key])
  }

  for (const key in config1) {
    if (config1.hasOwnProperty(key)) {
      toMerge(key)
    }
  }

  for (const key in config2) {
    if (config2.hasOwnProperty(key)) {
      toMerge(key)
    }
  }

  return merged
}

export default configMerge
