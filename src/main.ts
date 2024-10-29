import Cancel, { isCancel } from './cancel/cancel'
import CancelToken from './cancel/canceltoken'
import Axios from './core/axios'
import configMerge from './core/merge'
import defaultConfig from './default'
import { extend } from './helpers/utils'
import { AxiosDefaults, AxiosStatic } from './types'

function createAxiosInstance(defualts: AxiosDefaults): AxiosStatic {
  const ctx = new Axios(defualts)
  const instance = Axios.prototype.request.bind(ctx)
  extend(ctx, instance)
  return instance as AxiosStatic
}

const axios = createAxiosInstance(defaultConfig)

axios.create = function (config) {
  return createAxiosInstance(configMerge(defaultConfig, config) as AxiosDefaults)
}
axios.CancelToken = CancelToken
axios.isCancel = isCancel
axios.Cancel = Cancel

export default axios
