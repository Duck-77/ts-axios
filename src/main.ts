import Axios from './core/axios'
import configMerge from './core/merge'
import defaultConfig from './default'
import { extend } from './helpers/utils'
import { AxiosDefaults, AxiosInstance, AxiosStatic } from './types'

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

export default axios
