import axios from '../../src'
axios.defaults.headers.get['c'] = 'a'

const postA = () => {
  return axios('/all/get/A', {
    responseType: 'text',
  })
}

axios.interceptors.request.use((config) => {
  return config
})

axios.all([postA()]).then(
  axios.spread(function (resA) {
    console.log('resA', resA)
  }),
)
