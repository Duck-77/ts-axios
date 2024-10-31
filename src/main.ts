import Cancel, { isCancel } from './cancel/cancel'
import CancelToken from './cancel/canceltoken'
import Axios from './core/axios'
import configMerge from './core/merge'
import defaultConfig from './default'
import { extend } from './helpers/utils'
import { AxiosDefaults, AxiosStatic } from './types'

/**
 * 创建axios实例
 * @param defualts
 * @returns
 */
function createAxiosInstance(defualts: AxiosDefaults): AxiosStatic {
  const ctx = new Axios(defualts)
  const instance = Axios.prototype.request.bind(ctx)
  extend(ctx, instance)
  return instance as AxiosStatic
}

const axios = createAxiosInstance(defaultConfig)

/**
 * 拓展axios静态方法
 * @param config
 * @returns
 */
axios.create = function (config) {
  return createAxiosInstance(configMerge(defaultConfig, config) as AxiosDefaults)
}
axios.CancelToken = CancelToken
axios.isCancel = isCancel
axios.Cancel = Cancel
axios.all = function all(promises) {
  return Promise.all(promises)
}
axios.spread = function spread(callback) {
  return function wrap(arr) {
    /** 将数组参数展开成独立的参数传递为callback */
    return callback.apply(null, arr)
  }
}
axios.Axios = Axios

export default axios
