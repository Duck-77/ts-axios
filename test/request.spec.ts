import axios, { AxiosResponse, AxiosError } from '../src'
import { getAjaxRequest } from './helper'

describe('requests', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', async () => {
    axios('/foo')

    const request = await getAjaxRequest()
    expect(request.url).toBe('/foo')
    expect(request.method).toBe('GET')
  })

  test('should treat method value as string', () => {
    axios({
      url: '/foo',
      method: 'POST',
    }).then((response) => {
      //当下面的响应成功，这里的expect就会执行
      expect(response.config.method).toBe('POST')
    })

    return getAjaxRequest().then((request) => {
      //获取最近一次axios请求并模拟一个响应
      request.respondWith({
        status: 200,
      })
    })
  })

  test('should reject on network errors', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    return axios('/foo').then(resolveSpy).catch(rejectSpy).then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()
    }
  })

  test('should reject when request timeout', (done) => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'post',
    }).catch((error) => {
      err = error
    })

    getAjaxRequest().then((request) => {
      //@ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000ms exceeded')
      }, 100)

      done()
    })
  })

  test('should reject when validateStatus returns false', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status !== 500
      },
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 500,
      })
    })

    function next(reason: AxiosError | AxiosResponse) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code: 500')
      expect((reason as AxiosError).response?.status).toBe(500)
    }
  })

  test('should resolve when validateStatus returns true', () => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios
      .get('/foo', {
        validateStatus(status) {
          return status === 500
        },
      })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 500,
      })
    })

    function next(res: AxiosError | AxiosResponse) {
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(resolveSpy).toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')
    }
  })

  test('should return JSON when resolved', (done) => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: '',
      },
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
    }).then((res) => {
      response = res
    })

    getAjaxRequest().then((res) => {
      res.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"errno":0}',
      })

      setTimeout(() => {
        expect(response.data).toEqual({ errno: 0 })
        done()
      }, 100)
    })
  })

  test('should return JSON when rejecting', (done) => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: '',
      },
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
    }).catch((err) => {
      response = err.response
    })

    getAjaxRequest().then((res) => {
      res.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error":"BAD USERNAME","code":1}',
      })

      setTimeout(() => {
        expect(typeof response.data).toBe('object')
        expect(response.data.error).toEqual('BAD USERNAME')
        expect(response.data.code).toEqual(1)
        done()
      }, 100)
    })
  })

  test('should supply correct response', (done) => {
    let response: AxiosResponse

    axios.post('/foo').then((res) => {
      response = res
    })

    getAjaxRequest().then((res) => {
      res.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo":"bar"}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      })

      setTimeout(() => {
        expect(response.data.foo).toBe('bar')
        expect(response.status).toBe(200)
        expect(response.statusText).toEqual('OK')
        expect(response.headers['Content-Type']).toEqual('application/json')
        done()
      }, 100)
    })
  })

  test('should allow overriding Conten-Type header case-insensitive', () => {
    let response: AxiosResponse
    axios
      .post(
        '/foo',
        { a: 1 },
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
      .then((res) => {
        response = res
      })

    return getAjaxRequest().then((res) => {
      expect(res.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array text response', () => {
    let response: AxiosResponse

    axios('/foo', {
      responseType: 'text',
    }).then((data) => {
      response = data
    })

    return getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        responseText: '{\n  "name": "John",\n  "age": 30\n}',
      })

      setTimeout(() => {
        expect(response.config.responseType).toBe('text')
      }, 100)
    })
  })

  test('should support array buffer response', (done) => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer',
    }).then((data) => {
      response = data
    })

    getAjaxRequest().then((request) => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world'),
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })
})
