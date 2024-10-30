import axios from '../../src'
const baseURL = 'http://localhost:8088'

// 跨域
axios({
  url: baseURL + '/cross/xsrf/get',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'XSRF-TOKEN-D',
}).then((res) => {
  console.log('跨域[token]',res)
})

// 同源
axios({
  url: '/xsrf/get',
}).then((res) => {
  console.log('同源[token]',res)
})
