// 合并配置
import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

// 默认合并策略: 后面的值不为空则覆盖前面的值
function defaultMergeStrategy(value1: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : value1
}
// 对于特殊字段的合并策略: 后面的值完全覆盖前面的值
function speicalMergeStrategy(_: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : undefined
}
// 对于复杂类型字段的合并策略
function deepMergeStrategy(value1: any, value2: any): any {
  /**
   * 1. 如果value2是对象的话，直接合并value1和value2
   * 2. 如果value2不是对象但是不为空的话，直接使value2覆盖value1(不关心value1是不是对象)
   * 3. 如果value2为空，且value1为对象的话，则直接使用value1的值
   * 4. 如果value2为空，则value1不为对象但是有值，直接使用value1的值
   */
  if (isPlainObject(value2)) {
    return deepMerge(value1, value2)
  } else if (typeof value2 !== 'undefined') {
    return value2
  } else if (isPlainObject(value1)) {
    return deepMerge(value1)
  } else if (typeof value1 !== 'undefined') {
    return value1
  }
}

// 特殊字段
const SepicalKeys = ['url', 'data']
const DeepKeys = ['headers', 'params']
// 根据key来分配不同的合并策略
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
 * 合并策略：对于url,等配置，后续的配置要覆盖前面的配置
 * @param config1 配置1
 * @param config2 配置2
 */
const configMerge: IConfigMerge = function (config1, config2) {
  if (!config2) {
    config2 = {}
  }

  const merged: AxiosRequestConfig = {}
  const toMerge = (key: string) => {
    const mergeFunc = mergeStrategy[key] || defaultMergeStrategy
    merged[key] = mergeFunc(config1[key], config2[key])
  }

  for (const key in config1) {
    toMerge(key)
  }

  for (const key in config2) {
    toMerge(key)
  }

  return merged
}

export default configMerge
