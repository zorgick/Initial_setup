const webpack = require('webpack')
const nodemon = require('nodemon')
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const paths = require('config/paths')
const getConfig = require('config/webpack')
const envBuilder = require('config/env')
const { logMessage, compilerPromise } = require('scripts/utils')

const { raw } = envBuilder()
const { PORT, HOST, NODE_ENV } = raw

const webpackConfig = getConfig(NODE_ENV || 'development')
const WEBPACK_PORT = Number(PORT) + 1

const app = express()

const start = async () => {
  const [clientConfig, serverConfig] = webpackConfig
  clientConfig.entry.app = [
    `webpack-hot-middleware/client?path=${HOST}:${WEBPACK_PORT}/__webpack_hmr`,
    ...clientConfig.entry.app
  ]

  clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
  clientConfig.output.hotUpdateChunkFilename =
    'updates/[id].[hash].hot-update.js'

  const publicPath = clientConfig.output.publicPath

  clientConfig.output.publicPath = [`${HOST}:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

  serverConfig.output.publicPath = [`${HOST}:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

  // @ts-ignore
  const multiCompiler = webpack([clientConfig, serverConfig])

  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client'
  )
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server'
  )

  const clientPromise = compilerPromise('client', clientCompiler)
  const serverPromise = compilerPromise('server', serverCompiler)

  const watchOptions = {
    ignored: /node_modules/,
    stats: clientConfig.stats
  }

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    return next()
  })

  app.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      stats: clientConfig.stats,
      watchOptions
    })
  )

  app.use(webpackHotMiddleware(clientCompiler))

  app.use('/initial-setup', express.static(paths.clientBuild))

  app.listen(WEBPACK_PORT)

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats))
      return
    }

    if (error) {
      logMessage(error, 'error')
    }

    if (stats.hasErrors()) {
      const info = stats.toJson()
      const errors = info.errors[0].split('\n')
      logMessage(errors[0], 'error')
      logMessage(errors[1], 'error')
      logMessage(errors[2], 'error')
    }
  })

  // wait until client and server is compiled
  try {
    await serverPromise
    await clientPromise
  } catch (error) {
    logMessage(error, 'error')
  }

  const script = nodemon({
    script: `${paths.serverBuild}/server.js`,
    ignore: [
      'src',
      'scripts',
      'config',
      './*.*',
      'build/client',
      '**/locales',
      '**/tmp'
    ],
    delay: 200
  })

  script.on('restart', () => {
    logMessage('Server side app has been restarted.', 'warning')
  })

  script.on('quit', () => {
    console.log('Process ended')
    process.exit()
  })

  script.on('error', () => {
    logMessage('An error occured. Exiting', 'error')
    process.exit(1)
  })
}

start()
