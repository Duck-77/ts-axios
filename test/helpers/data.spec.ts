import { transformRequest, transformResponse } from '../../src/helpers/data'
import { AxiosResponse } from '../../src/types'

describe('helpers::data', () => {
  describe('transformRequest', () => {
    test('should transform request data to string if data is a PlainObject', () => {
      const a = { a: 1 }
      expect(transformRequest(a)).toBe('{"a":1}')
    })
    test('should do nothing if data is not a PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('tramformResponse', () => {
    test('should transform response data to Object if data is a JSON string', () => {
      const a = '{"a":1}'
      expect(transformResponse(a)).toEqual({ a: 1 })
    })
    test('should do nothing if data is not a JSON string', () => {
      const a = '{a:1}'
      expect(transformResponse(a)).toBe('{a:1}')
    })
    test('should do nothing if data is not a string', () => {
      const a = { a: 1 }
      expect(transformResponse(a)).toBe(a)
    })
    test('should be AxiosResponse if response is not null', () => {
      const a = { a: 1 }
      const response: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        config: {},
        headers: {},
        request: null,
      }
      expect(transformResponse(a, response)).toEqual({
        data: { a: 1 },
        status: 200,
        statusText: 'OK',
        config: {},
        headers: {},
        request: null,
      })
    })
  })
})
