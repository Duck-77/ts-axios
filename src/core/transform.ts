import { AxiosTransformer } from '../types'

/**
 * 一体式data处理函数
 * @param data 请求体data
 * @param headers 请求头
 * @param callbacks 处理函数,用于管道式的处理data
 * @returns 处理后的data
 */
function tansform(
  data: any,
  headers: any,
  transformers?: AxiosTransformer | AxiosTransformer[],
): any {
  if (!transformers) {
    return data
  }

  if (!Array.isArray(transformers)) {
    transformers = [transformers]
  }

  transformers.forEach((tansformer) => {
    data = tansformer(data, headers)
  })

  return data
}

export default tansform
