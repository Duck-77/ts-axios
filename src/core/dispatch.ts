import { AxiosRequestConfig, AxiosResponse } from '../types'
import { buildUrl } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default async function dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  // 处理使用同一个cancelToken取消后重复请求的情况
  processRepeatRequest(config)
  // 处理Axios配置
  processConfig(config)
  // 发送XHR请求 获取响应
  const res = await xhr(config)
  return processResponseData(res)
}

/**
 * 统一处理Axios配置
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = flattenHeaders(config.headers, config.method!)
  config.data = transform(config.data, config.headers, config.transformRequest)
}

/**
 * 处理URL与Params参数
 * @param config
 * @returns
 */
function transformUrl(config: AxiosRequestConfig): string {
  const { url = '', params } = config
  return buildUrl(url, params)
}

function processResponseData(response: AxiosResponse): AxiosResponse {
  return transform(response.data, response.headers, response.config.transformResponse)
}

function processRepeatRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.repeatRequest()
  }
}
