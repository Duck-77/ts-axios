const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

//启动8088端口服务
require("./server2")

const app = express()
const compiler = webpack(WebpackConfig)

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false,
    },
  }),
)

app.use(webpackHotMiddleware(compiler))
app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

const router = express.Router()

registerSimpleRouter()
registerBaseRouter()
registerErrorRouter()
registerExtendRouter()
registerInterceptorRouter()
registerTransformRouter()
regitsterCancelRouter()
registerWithCredentialRouter()

function registerSimpleRouter() {
  router.get('/simple/get', function (req, res) {
    res.json({
      msg: `hello worldl`,
    })
  })
}

function registerBaseRouter() {
  router.get('/base/get', function (req, res) {
    res.json(req.query)
  })

  router.post('/base/post', function (req, res) {
    res.json(req.body)
  })

  router.post('/base/buffer', function (req, res) {
    let msg = []
    req.on('data', (chunk) => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      let buf = Buffer.concat(msg)
      console.log('buf.toJSON()', buf.toJSON())
      res.json(buf.toJSON())
    })
  })
}

function registerErrorRouter() {
  router.get('/error/get', function (req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: 'hello world',
      })
    } else {
      res.status(500).json({
        msg: 'server error',
      })
    }
  })

  router.get('/error/timeout', function (req, res) {
    setTimeout(() => {
      res.json({
        msg: 'hello world',
      })
    }, 3000)
  })
}

function registerExtendRouter() {
  router.get('/extend/get', function (_, res) {
    res.json({
      msg: 'hello world',
    })
  })

  router.delete('/extend/delete', function (_, res) {
    res.end()
  })

  router.options('/extend/options', function (_, res) {
    res.end()
  })

  router.head('/extend/head', function (_, res) {
    res.end()
  })

  router.post('/extend/post', function (req, res) {
    res.json(req.body)
  })

  router.put('/extend/put', function (req, res) {
    res.json(req.body)
  })

  router.patch('/extend/patch', function (req, res) {
    res.json(req.body)
  })
}

function registerInterceptorRouter() {
  router.get('/interceptor/get', function (req, res) {
    res.send(`200Ok`)
  })
}

function registerTransformRouter() {
  router.post('/transform/post', function (req, res) {
    res.send(req.body)
  })
}

function regitsterCancelRouter() {
  router.get('/cancel/get', function (req, res) {
    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', function (req, res) {
    setTimeout(() => {
      res.json(req.body)
    })
  })
}

function registerWithCredentialRouter() {
  router.post('/credentials/post', function (req, res) {
    res.json({
      name:'同源',
      ...req.cookies
    })
  })
}

app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})
