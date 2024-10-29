import axios from '../../src'

axios.defaults.headers.common['test'] = 'test'

axios({
  method: 'get',
  url: '/simple/get',
  data: {
    a: 1,
  },
  params: {
    a: 1,
    b: 2,
  }
})
