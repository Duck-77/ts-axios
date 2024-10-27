import { AxiosDefaults } from './types'

const defaultConfig: AxiosDefaults = {
  url: '',
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'accplication/json, text/plain, */*',
    },
  },
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
