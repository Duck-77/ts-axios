import Axios from './core/Axios'
import defaultConfig from './default'
import { extend } from './helpers/utils'
import { AxiosDefaults, AxiosInstance } from './types'

function createAxiosInstance(defualts: AxiosDefaults): AxiosInstance {
  const ctx = new Axios(defualts)
  const instance = Axios.prototype.request.bind(ctx)
  extend(ctx, instance)
  return instance as AxiosInstance
}

const axios = createAxiosInstance(defaultConfig)

export default axios
