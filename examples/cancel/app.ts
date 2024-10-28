import axios from '../../src'
import { Canceler } from '../../src/types/canceltoken'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios({
  url: '/cancel/get',
  method: 'get',
  cancelToken: source.token,
}).catch((e) => {
  if (axios.isCancel(e)) {
    console.error('1.request(url:/cancel/get/) has be canceled')
  }
})

setTimeout(() => {
  // 暂停第一个请求
  source.cancel(`cancel request which cancelToken = ${source.token}`)

  // 由于这个post请求和上面被暂停的请求使用的同一个token，所以这个请求无法发送并抛出错误
  axios({
    url: '/cancel/post',
    method: 'post',
    cancelToken: source.token,
  }).catch((e) => {
    if (axios.isCancel(e)) {
      console.error('1.request(url:/cancel/post/) has be canceled')
    }
  })
}, 100)

let cancel: Canceler

console.log(axios.defaults)

axios
  .get('/cancel/get', {
    cancelToken: new CancelToken((c) => {
      cancel = c
    }),
  })
  .catch((e) => {
    if (axios.isCancel(e)) {
      console.error('2.request(url:/cancel/post/) has be canceled')
    }
  })

setTimeout(() => {
  cancel()
}, 300)
