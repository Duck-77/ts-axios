import axios from '../../src'

/** 模拟跨域 */
axios
  .post(
    '/credentials/post',
    { a: 1 },
    {
      baseURL: 'http://localhost:8088',
      withCredentials: true,
    },
  )
  .then((res) => {
    console.log(res)
  })

/** 同源请求 */
axios.post('/credentials/post', { b: 1 })
