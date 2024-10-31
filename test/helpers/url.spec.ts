import { buildURL, combineURL, isAbsolueURL, isSameOriginURL } from '../../src/helpers/url'

describe('helpers::url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    test('should support params', () => {
      expect(buildURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })

    test('should ignore params if it is empty or null or undefined', () => {
      const params = { foo: 'bar', bar: '', baz: null, bza: undefined }
      expect(buildURL('/foo', params)).toBe('/foo?foo=bar')
    })

    test('should support object params', () => {
      const params = { foo: 'bar', bar: { baz: 'ok' } }
      expect(buildURL('/foo', params)).toBe(`/foo?foo=bar&bar=${encodeURI('{"baz":"ok"}')}`)
    })

    test('should support date params', () => {
      const params = { foo: 'bar', bar: new Date() }
      expect(buildURL('/foo', params)).toBe(`/foo?foo=bar&bar=${params.bar.toISOString()}`)
    })

    test('should support array params', () => {
      const params = { foo: 'bar', bar: ['bar', 'baz'] }
      expect(buildURL('/foo', params)).toBe(`/foo?foo=bar&bar[]=bar&bar[]=baz`)
    })

    test('should support special code params', () => {
      const params = { foo: '@:$, ' }
      expect(buildURL('/foo', params)).toBe(`/foo?foo=@:$,+`)
    })

    test('should support url has init params', () => {
      const params = { foo: 'b' }
      expect(buildURL('/foo?bar=a', params)).toBe(`/foo?bar=a&foo=b`)
    })

    test('should remove # if url is hash mode', () => {
      const params = { foo: 'b' }
      expect(buildURL('/foo?bar=a#hash', params)).toBe(`/foo?bar=a&foo=b`)
    })

    test('should support URLSearchParams', () => {
      const params = new URLSearchParams({ bar: 'baz' })
      expect(buildURL('/foo', params)).toBe(`/foo?bar=baz`)
    })

    test('should use serializer if provide', () => {
      const params = { foo: 'b' }
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      expect(buildURL('/foo', params, serializer)).toBe(`/foo?foo=bar`)
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
  })
  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    test('should remove duplicate slashes', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    test('should combine insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    test('should support combine even if not have relativeURL', () => {
      expect(combineURL('https://api.github.com')).toBe('https://api.github.com')
    })
  })
  describe('isAbsolueURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsolueURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsolueURL('custom-scheme-v1.0://example.com')).toBeTruthy()
      expect(isAbsolueURL('HTTP://example.com')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsolueURL('123://example.com')).toBeFalsy()
      expect(isAbsolueURL('!valid://example/com')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsolueURL('//example/com')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsolueURL('/foo')).toBeFalsy()
      expect(isAbsolueURL('foo')).toBeFalsy()
    })
  })
  describe('isSameOriginURL', () => {
    test('should be same origin', () => {
      expect(isSameOriginURL(window.location.href)).toBeTruthy()
    })

    test('should not be same origin', () => {
      expect(isSameOriginURL('https://api.github.com')).toBeFalsy()
    })
  })
})
