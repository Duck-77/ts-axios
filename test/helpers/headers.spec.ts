import { flattenHeaders, buildHeaders, parseResponseHeaders } from '../../src/helpers/headers'

describe('helper::headers', () => {
  describe('parseResponseHeaders', () => {
    test('should be object if headers is not undefined', () => {
      const headers = `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36\r\n
       Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n
       Accept-Encoding: gzip, deflate, br\r\n
       Accept-Language: en-US,en;q=0.5\r\n
       Date: Tue, 31 October 2024 15:19:32 GMT\r\n
       Key:`
      expect(parseResponseHeaders(headers)['User-Agent']).toBe(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      )
      expect(parseResponseHeaders(headers)['Accept']).toBe('text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      expect(parseResponseHeaders(headers)['Accept-Encoding']).toBe('gzip, deflate, br')
      expect(parseResponseHeaders(headers)['Accept-Language']).toBe('en-US,en;q=0.5')
      expect(parseResponseHeaders(headers)['Key']).toBeUndefined()
    })

    test('should be empty object if headers is empty string', () => {
      expect(parseResponseHeaders('')).toEqual({})
    })
  })

  describe('buildHeaders', () => {
    test('should normalize Content-Type', () => {
      const headers: any = {
        'content-type': 'ctyp',
        'Content-length': 1024,
      }
      buildHeaders(headers, { a: 1 })
      expect(headers['content-type']).toBeUndefined()
      expect(headers['Content-Type']).toBe('ctyp')
      expect(headers['Content-length']).toBe(1024)
    })

    test('should set Content-Type if set data but not set Content-Type', () => {
      const headers: any = {}
      buildHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })
    test('should detete Content-type if data is null', () => {
      const headers = {
        'Content-Type': 1024,
      }
      buildHeaders(headers, null)
      expect(headers['Content-Type']).toBeUndefined()
    })
    test('should delete Content-Type if data is formData', () => {
      const headers = {
        'Content-Type': 1024,
      }
      const data = new FormData()
      buildHeaders(headers, data)
      expect(headers['Content-Type']).toBeUndefined()
    })
    test('should do nothing if header is null', () => {
      const headers = null
      buildHeaders(headers, { a: 1 })
      expect(headers).toBeNull()
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten headers if headers have deep object', () => {
      const headers = {
        Accppt: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue',
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue',
        },
        post: {
          'X-POST-HEADER': 'postHeaderVvalue',
        },
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accppt: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue',
      })
    })

    test('should flatten headers if your method is not existed', () => {
      const headers = {
        Accppt: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue',
        },
      }
      expect(flattenHeaders(headers, 'post')).toEqual({
        Accppt: 'application/json',
      })
    })
    test('should be null or undefined if headers is null of undefind', () => {
      expect(flattenHeaders(null, 'get')).toBeNull()
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
    })
  })
})
