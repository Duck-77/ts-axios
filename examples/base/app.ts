import axios from '../../src'

// // 请求参数为数组
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: ['bar', 'baz']
//   }
// })

// // 请求参数为对象
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: {
//       bar: 'baz'
//     }
//   }
// })

// // 请求参数为日期
// const date = new Date()
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     date
//   }
// })

// // 请求参数带特殊字符
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: '$% []'
//   }
// })

// // 请求参数中存在空值
// axios({
//   method: 'get',
//   url: '/base/get',
//   params: {
//     foo: 'baz',
//     baz: null,
//     bar: undefined,
//     bay: ''
//   }
// })

//  // 请求路径中已经存在参数
// axios({
//   method: 'get',
//   url: '/base/get?par=ok',
//   params: {
//     foo: 'baz'
//   }
// })

// // 请求路径中存在hash
// axios({
//   method: 'get',
//   url: '/base/get#hash',
//   params: {
//     foo: 'baz'
//   }
// })

axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
})

axios({
  method: 'post',
  url: '/base/post',
  responseType: 'json',
  data: {
    a: 3,
    b: 4
  }
}).then(res => {
  console.log(res)
})
