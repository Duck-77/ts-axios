import axios from '../../src'

const getA = () => {
  return axios.get('/A', {
    baseURL: '/all/get',
  })
}
const getB = () => {
  return axios.get('/B', {
    baseURL: '/all/get',
  })
}

axios.all([getA(), getB()]).then(
  axios.spread(function (resA) {
    console.log('resA', resA)
  }),
)

// axios.all([getA(),getB()]).then(([resA,resB])=>{
//    console.log(resA,resB)
// })
