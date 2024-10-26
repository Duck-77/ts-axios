import { AxiosPromise, AxiosRequestConfig } from '../types'
import { buildUrl } from '../helpers/url'
import xhr from './xhr'
import { tranformRequest } from '../helpers/data'
import buildHeaders from '../helpers/headers'

export default function dispathRequest(config: AxiosRequestConfig): AxiosPromise {
  // 处理Axios配置
  processConfig(config)
  // 发送XHR请求 获取响应
  return xhr(config)
}

/**
 * 统一处理Axios配置
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = tranformRequestHeaders(config)
  config.data = tranformRequestData(config)
}

/**
 * 处理URL与Params参数
 * @param config
 * @returns
 */
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

/**
 * 处理请求对象参数
 * @param config
 * @returns
 */
function tranformRequestData(config: AxiosRequestConfig): string {
  const { data } = config
  return tranformRequest(data)
}

/**
 * 处理请求头参数
 * @param config
 * @returns
 */
function tranformRequestHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return buildHeaders(headers, data)
}
