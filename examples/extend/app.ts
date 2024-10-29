import axios from '../../src'

axios({
  url: '/extend/get',
})

axios('/extend/get').then((res) => {
  console.log('请求成功', res.data)
})

axios.request({
  url: '/extend/get',
})

axios.get('/extend/get')
axios.delete('/extend/delete')
axios.head('/extend/head', {
  params: {
    a: 1,
  },
})
axios.options('/extend/options', {
  params: {
    b: 2,
  },
})

axios.post(
  '/extend/post',
  { msg: 'hello world' },
  {
    params: {
      a: 1,
    },
  },
)

axios.put('/extend/put', {
  data: 'hello world',
})

axios.patch('/extend/patch', {
  data: 'hello world',
})
