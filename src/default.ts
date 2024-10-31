import { AxiosDefaults, AxiosResponse } from './types'
import buildHeaders from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaultConfig: AxiosDefaults = {
  url: '',
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'accplication/json, text/plain, */*',
    },
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  transformRequest: [
    function (data: any, headers: any): any {
      buildHeaders(headers, data)
      return transformRequest(data)
    },
  ],
  transformResponse: [
    function (data: any, _, response: AxiosResponse): any {
      return transformResponse(data, response)
    },
  ],
  validateStatus(status) {
    return status >= 200 && status < 300
  },
}
export const useDataMethods = ['post', 'patch', 'put']
export const noDataMethods = ['get', 'delete', 'options', 'head']
useDataMethods.forEach((method) => {
  defaultConfig.headers![method] = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
})
noDataMethods.forEach((method) => {
  defaultConfig.headers![method] = {}
})

export default defaultConfig
