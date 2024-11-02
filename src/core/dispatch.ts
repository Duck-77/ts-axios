import { AxiosRequestConfig, AxiosResponse } from '../types'
import { buildURL, combineURL, isAbsolueURL } from '../helpers/url'
import xhr from './xhr'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform'

/**
 * dispatch XMLHttpRequest and return response
 * @param config axios request config
 * @returns
 */
export default async function dispatchRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  processthrowIfrepeatRequest(config)
  processConfig(config)
  const res = await xhr(config)
  return processResponseData(res)
}

/**
 * process axios config such as url, request headers
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * process request URL and Params
 * @param config
 * @returns
 */
export function transformURL(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsolueURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params, paramsSerializer)
}

/**
 * process reponse data with headers by axios reponse tranformers
 * @param response axios response
 * @returns
 */
function processResponseData(response: AxiosResponse): AxiosResponse {
  return transform(response.data, response.headers, response.config.transformResponse, response)
}

function processthrowIfrepeatRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfrepeatRequest()
  }
}
