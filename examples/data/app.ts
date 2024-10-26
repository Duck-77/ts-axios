import axios from '../../src'

// data传入对象
axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
})

// 传入对象并设置请求头
axios({
  method: 'post',
  url: '/base/post',
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json, text/plain, */*'
  },
  data: {
    a: 1,
    b: 2
  }
})

// 传入UrlSearchParams对象
const paramString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramString)

axios({
  method: 'post',
  url: '/base/post',
  data: searchParams
})

// data传入Buffer
const d = { msg: 'hello world' }
const blob = new Blob([JSON.stringify(d, null, 2)])
axios({
  method: 'post',
  url: '/base/buffer',
  data: blob
})
