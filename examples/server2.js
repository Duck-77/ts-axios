const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const cors = require('cors')
const webpackConfig = require('./webpack.config')

const express = require('express')
const app = express()
const router = express.Router()

const AccessControlAllows = {
  'Access-Control-Allow-Origin': 'http://localhost:8080',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, XSRF-TOKEN-D, Authorization',
}

app.use(express.static(__dirname))

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'XSRF-TOKEN-D','Authorization'],
}

//设置cors之后就不需要设置预检请求了
// app.use(cors(corsOptions))

// app.all('/*', async function (req, res, next) {
//   console.log("请求",req.path)
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Headers', 'Content-type, XSRF-TOKEN-D')
//   res.header('Access-Control-Methods', '*')
//   if(req.method.toLowerCase() === 'options'){
//     res.status(204).send()
//   }else{
//     next()
//   }
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

router.post('/credentials/post', function (req, res) {
  res.set(AccessControlAllows)
  res.json(req.cookies)
})
//对于跨域请求，浏览器需要先发送一个options请求
router.options('/credentials/post', function (req, res) {
  res.set(AccessControlAllows)
  res.sendStatus(204)
})

router.get('/cross/xsrf/get', function (req, res) {
  /** 跨域情况下,需要从请求头中获取token */
  res.json({ token: req.header('XSRF-TOKEN-D') })
})

router.options('/cross/xsrf/get', function (req, res) {
  console.log('预检请求:',req.headers['origin'])
  res.set(AccessControlAllows)
  res.sendStatus(204)
})

app.use(router)

const port = 8088

app.listen(port, () => {
  console.log(`server is runing on http://localhost:${port}`)
})
