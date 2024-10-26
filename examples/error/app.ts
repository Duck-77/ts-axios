import axios from '../../src'

/**
 * 404
 */
axios({
  url: '/error/404'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.error(e)
  })

/**
 * networdk error
 */
setTimeout(() => {
  axios({
    url: '/error/404'
  })
    .then(res => {
      console.log(res)
    })
    .catch(e => {
      console.error(e)
    })
}, 5000)

/**
 * 可能出现500错误
 */
axios({
  url: '/error/get'
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.error(e)
  })

/**
 * 超时错误,timeout > 3000
 */
axios({
  url: '/error/timeout',
  timeout: 2000
})
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.error(e)
  })
