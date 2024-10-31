const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const webpack = require('webpack')
const multer = require('multer')
const multipart = require('connect-multiparty')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const atob = require('atob')

//启动8088端口服务
require('./server2')

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
app.use(
  express.static(__dirname, {
    setHeaders(res) {
      res.cookie('XSRF-TOKEN-D', 'qwerty')
    },
  }),
)

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    paramterLimit: 50000,
  }),
)
app.use(cookieParser())
app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'upload-file'),
    maxFilesSize: 10 * 1024 * 1024,
  }),
)

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 10 },
})

const router = express.Router()

registerSimpleRouter()
registerBaseRouter()
registerErrorRouter()
registerExtendRouter()
registerInterceptorRouter()
registerTransformRouter()
regitsterCancelRouter()
registerWithCredentialRouter()
registerXSRFRouter()
registerProgressRouter()

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
      name: '同源',
      ...req.cookies,
    })
  })
}

function registerXSRFRouter() {
  router.get('/xsrf/get', function (req, res) {
    /** 同源情况下,直接获取cookie中的 */
    res.json({ token: req.cookies['XSRF-TOKEN-D'] })
  })
}

function registerProgressRouter() {
  router.post('/onprogress/upload', function (req, res) {
    if (!req.files && !req.body) {
      return res.status(400).send('No files Upload!')
    } else {
      return res.end('upload success!')
    }
  })
}

function registerAuthRouter() {
  router.post('/auth/post', function (req, res) {
    res.setHeader('content-type', 'text/plain')

    const auth = req.headers['authorization']
    const [type, credentails] = auth.split(' ')
    const [username, password] = atob(credentails).split(':')
    if (type === 'Basic' && username === 'qyq' && password === '123456') {
      const msg = 'hello world!'
      let _resolve = null
      const promise = new Promise((resolve) => {
        _resolve = resolve
      })
      for (let i = 0; i < msg.length; i++) {
        setTimeout(() => {
          res.write(msg[i])
          if (i === msg.length - 1) {
            _resolve()
          }
        }, i * 300)
      }
      promise.then(() => {
        res.end()
      })
    } else {
      res.status(401).send({ msg: 'UnAuthorization' })
    }
  })
}

function resigterAllRouter() {
  router.get('/all/get/A', function (req, res) {
    res.json({ msg: 'hello,A' })
  })

  router.get('/all/get/B', function (req, res) {
    res.json({ msg: 'hello,B' })
  })
}

registerAuthRouter()
resigterAllRouter()

app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})
