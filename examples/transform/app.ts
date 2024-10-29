import axios, { AxiosTransformer } from '../../src'
import qs from 'qs'

const instance = axios.create({
  headers:{
    common:{
      test: 'test'
    }
  }
})


instance({
  method: 'post',
  url: '/transform/post',
  data: {
    a: 1,
  },
  params: {
    a: 1,
    b: 2,
  },
  transformRequest: [
    function (data) {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  headers:{
    "Authorization":"aaa"
  }
})
