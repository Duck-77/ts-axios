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
//   'Access-Control-Allow-Credential': true,
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

app.use(express.static(__dirname))

const corsOptions = {
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: 'Content-Type',
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

router.post('/credentials/post', function (req, res) {
  res.set(AccessControlAllows)
  res.json(req.cookies)
})
//对于跨域请求，浏览器需要先发送一个options请求
router.options('/credentials/post',function(req,res){
    res.set(AccessControlAllows)
    res.sendStatus(204)
})

app.use(router)

const port = 8088

app.listen(port, () => {
  console.log(`server is runing on http://localhost:${port}`)
})
