const webpack = require('webpack')
const chalk = require('chalk')
const getConfig = require('config/webpack')
const { logMessage, compilerPromise } = require('scripts/utils')

const webpackConfig = getConfig(process.env.NODE_ENV || 'production')

const build = async () => {
  const [clientConfig] = webpackConfig
  // @ts-ignore
  const clientCompiler = webpack(clientConfig)

  const clientPromise = compilerPromise('client', clientCompiler)

  clientCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(clientConfig.stats))
      return
    }
    console.error(chalk.red(stats.compilation.errors))
  })

  try {
    await clientPromise
    logMessage('Done!', 'info')
    process.exit()
  } catch (error) {
    logMessage(error, 'error')
  }
}

build()
