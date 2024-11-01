import axios from '../../src'

const postA = () => {
  return axios({
    method: 'POST',
    data: new FormData(),
    baseURL: '/all/post',
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
