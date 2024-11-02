import { AxiosResponse, AxiosTransformer } from '../types'

/**
 * Used to handle all transformers configured in Axios
 * @param data request or respone data
 * @param headers request headers
 * @param transformers collection of axios transformers
 * @param response axios response
 * @returns 处理后的data
 */
function tansform(data: any, headers: any, transformers?: AxiosTransformer | AxiosTransformer[], response?: AxiosResponse): any {
  if (!transformers) {
    return data
  }

  if (!Array.isArray(transformers)) {
    transformers = [transformers]
  }

  transformers.forEach((tansformer) => {
    data = tansformer(data, headers, response)
  })

  return data
}

export default tansform
