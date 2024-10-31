import cookie from '../../src/helpers/cookie'

describe('helpers::cookiee', () => {
  test('should be cookies', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('foo')).toBe('bar')
  })

  test('should be null if cookie name is not be existed', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('bar')).toBeNull()
  })
})
