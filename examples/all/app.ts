import axios from '../../src'

axios.defaults.headers['GET'] = {
  'D-GET': 'get',
}

const getA = () => {
  return axios({
    url: '/A',
    method: 'get',
    baseURL: '/all/get',
  })
}

axios.interceptors.request.use((config) => {
  return config
})

axios.all([getA()]).then(
  axios.spread(function (resA) {
    console.log('resA', resA)
  }),
)

