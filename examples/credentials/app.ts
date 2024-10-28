import axios from '../../src'

const baseUrl = 'http://localhost:8088'

axios.post(
  baseUrl + '/credentials/post',
  { a: 1 },
  {
    withCredentials: true,
  },
)

axios.post('/credentials/post', { b: 1 })
