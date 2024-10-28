import { AxiosDefaults } from './types'
import buildHeaders from './helpers/headers'
import { tranformRequest, tranformResponse } from './helpers/data'

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
      return tranformRequest(data)
    },
  ],
  transformResponse: [
    function (data: any): any {
      return tranformResponse(data)
    },
  ],
}
export const useDataMethods = ['post', 'patch', 'put']
export const noDataMethods = ['get', 'delete', 'options', 'head']
useDataMethods.forEach((method) => {
  defaultConfig.headers![method] = {
    'Content-type': 'application/x-www-form-urlencoded',
  }
})
noDataMethods.forEach((method) => {
  defaultConfig.headers![method] = {}
})

export default defaultConfig
