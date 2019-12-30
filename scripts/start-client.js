const express = require('express')
const webpack = require('webpack')
const chalk = require('chalk')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const getConfig = require('config/webpack')
const paths = require('config/paths')
const envBuilder = require('config/env')
const { compilerPromise, logMessage } = require('scripts/utils')

const { raw } = envBuilder()
const { PORT, HOST, NODE_ENV } = raw
const app = express()

const webpackConfig = getConfig(NODE_ENV || 'development')

const start = async () => {
  const [clientConfig] = webpackConfig
  clientConfig.entry.app = [
    `webpack-hot-middleware/client?path=${HOST}:${PORT}/__webpack_hmr`,
    ...clientConfig.entry.app
  ]

  clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
  clientConfig.output.hotUpdateChunkFilename =
    'updates/[id].[hash].hot-update.js'

  // @ts-ignore
  const webpackCompiler = webpack([clientConfig])
  const clientCompiler = webpackCompiler.compilers.find(
    compiler => compiler.name === 'client'
  )
  const clientPromise = compilerPromise('client', clientCompiler)

  const watchOptions = {
    ignored: /node_modules/,
    stats: clientConfig.stats
  }

  app.use((req, res, next) => {
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

  app.use('*', express.static(paths.clientBuild))

  try {
    await clientPromise

    app.listen(PORT, () => {
      console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(`App is running: ${HOST}:${PORT}`)
      )
    })
  } catch (error) {
    logMessage(error, 'error')
  }
}

start()
