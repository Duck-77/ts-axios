import axios from '../../src'

axios.interceptors.request.use((config) => {
  config.headers.test += 'a'
  return config
})

axios.interceptors.request.use((config) => {
  config.headers.test += 'b'
  return config
})

axios.interceptors.request.use((config) => {
  config.headers.test += 'c'
  return config
})

axios.interceptors.response.use((response) => {
  response.data += ' a'
  return response
})

axios.interceptors.response.use((response) => {
  response.data += 'b'
  return response
})

axios.interceptors.response.use((response) => {
  response.data += 'c'
  return response
})

axios.interceptors.request.eject(1)
axios.interceptors.response.eject(1)

axios({
  method: 'get',
  url: '/interceptor/get',
  headers: {
    test: '',
  },
}).then((res) => {
  const app = document.querySelector('#app')
  app!.innerHTML = res.data as string
})
