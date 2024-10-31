import { flattenHeaders, buildHeaders, parseResponseHanders } from '../../src/helpers/headers'

describe('helper::headers', () => {
  describe('parseResponseHeaders', () => {
    test("should be headers' object if headers is not undefined", () => {
      const headers = `
       User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36\r\n
       Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n
       Accept-Encoding: gzip, deflate, br\r\n
       Accept-Language: en-US,en;q=0.5\r\n
       Key:`
      expect(parseResponseHanders(headers)['User-Agent']).toBe(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
      )
      expect(parseResponseHanders(headers)['Accept']).toBe('text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
      expect(parseResponseHanders(headers)['Accept-Encoding']).toBe('gzip, deflate, br')
      expect(parseResponseHanders(headers)['Accept-Language']).toBe(' en-US,en;q=0.5')
      expect(parseResponseHanders(headers)['Key']).toBe('')
    })

    test('should be empty object if headers is empty string', () => {
      expect(parseResponseHanders('')).toBe({})
    })
  })

  describe('buildHeaders', () => {
    test("should be headers' object if headers is not undefined", () => {})

    test('should be empty object if headers is empty string', () => {})
  })

  describe('flattenHeaders', () => {
    test("should be headers' object if headers is not undefined", () => {})

    test('should be empty object if headers is empty string', () => {})
  })
})
