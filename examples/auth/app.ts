import axios from '../../src'
import qs from "qs"

axios
  .post(
    '/auth/post',
    qs.stringify({ msg: 'hello world' }),
    {
      auth: {
        username: 'qyq2',
        password: '123456',
      },
    },
  )
  .then((res) => {
    console.log(res)
  })
