import { AxiosRequestConfig, AxiosResponse } from '../types'
import { buildURL, combineURL, isAbsolueURL } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default async function dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  processRepeatRequest(config)
  processConfig(config)
  const res = await xhr(config)
  return processResponseData(res)
}

/**
 * 统一处理Axios配置
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * 处理URL与Params参数
 * @param config
 * @returns
 */
export function transformURL(config: AxiosRequestConfig): string {
  let { url = '', params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsolueURL(url)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url, params, paramsSerializer)
}

/**
 * 用于利用reponse管道处理AxiosResponse响应
 * @param response
 * @returns
 */
function processResponseData(response: AxiosResponse): AxiosResponse {
  return transform(response.data, response.headers, response.config.transformResponse, response)
}

function processRepeatRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.repeatRequest()
  }
}
