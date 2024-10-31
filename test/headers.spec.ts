import axios from '../src'
import { getAjaxRequest } from './helper'

function testHeaderValue(headers: any, key: string, val?: string): void {}

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should use defualt common headers', () => {
    const headers = axios.defaults.headers.common
    axios('foo')

    return getAjaxRequest().then((request) => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  test('should add extra headers for post', () => {
    axios.post('/foo', 'fizz=buzz')

    return getAjaxRequest().then((request) => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'appliaction/x-www-form-urlencoded')
    })
  })
})
