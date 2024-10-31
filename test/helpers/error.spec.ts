import { createAxiosError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helper::error', () => {
  describe('createAxiosError', () => {
    test('should be AxiosError Object', () => {
      const request = new XMLHttpRequest()
      const config: AxiosRequestConfig = {}
      const code: string = 'Known'
      const response: AxiosResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        config: {},
        headers: {},
        request: null,
      }
      const message = 'test error'
      const axiosError = createAxiosError(message, config, code, request, response)
      expect(axiosError instanceof Error).toBeTruthy()
      expect(axiosError.message).toBe('test error')
      expect(axiosError.config).toBe(config)
      expect(axiosError.code).toBe('Known')
      expect(axiosError.request).toBe(request)
      expect(axiosError.response).toBe(response)
      expect(axiosError.isAxiosError).toBeTruthy()
    })

    test('should be AxiosError Object even if some args is undefined', () => {
      const config: AxiosRequestConfig = {}
      const message = 'test error'
      const axiosError = createAxiosError(message, config)
      expect(axiosError instanceof Error).toBeTruthy()
      expect(axiosError.message).toBe('test error')
      expect(axiosError.config).toBe(config)
      expect(axiosError.code).toBe(undefined)
      expect(axiosError.request).toBe(undefined)
      expect(axiosError.response).toBe(undefined)
      expect(axiosError.isAxiosError).toBeTruthy()
    })
  })
})
