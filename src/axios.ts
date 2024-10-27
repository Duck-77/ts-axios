import Axios from './core/Axios'
import { extend } from './helpers/utils'
import { AxiosInstance } from './types'

function createAxiosInstance(): AxiosInstance {
  const ctx = new Axios()
  const instance = Axios.prototype.request.bind(ctx)
  extend(ctx, instance)
  return instance as AxiosInstance
}

const axios = createAxiosInstance()

export default axios
