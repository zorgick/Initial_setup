const webpack = require('webpack')
const chalk = require('chalk')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const getConfig = require('config/webpack')
const paths = require('../config/paths')
const { logMessage, compilerPromise, sleep } = require('scripts/utils')
const envBuilder = require('config/env')

const { raw } = envBuilder()
const { HOST, NODE_ENV } = raw
const webpackConfig = getConfig(NODE_ENV || 'development')

const generateStaticHTML = async () => {
  const nodemon = require('nodemon')
  const fs = require('fs')
  const puppeteer = require('puppeteer')
  const PORT = await choosePort('localhost', 8505)

  process.env.PORT = String(PORT)

  const script = nodemon({
    script: `${paths.serverBuild}/server.js`,
    ignore: ['*']
  })

  script.on('start', async () => {
    try {
      await sleep(2000)
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()
      await page.goto(`${HOST}:${PORT}`)
      const pageContent = await page.content()
      fs.writeFileSync(`${paths.clientBuild}/index.html`, pageContent)
      await browser.close()
      script.emit('quit')
    } catch (err) {
      script.emit('quit')
      console.log(err)
    }
  })

  script.on('exit', code => {
    process.exit(code)
  })

  script.on('crash', () => {
    process.exit(1)
  })
}

const build = async () => {
  const [clientConfig, serverConfig] = webpackConfig
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

  serverCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats))
      return
    }
    console.error(chalk.red(stats.compilation.errors))
  })

  clientCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(clientConfig.stats))
      return
    }
    console.error(chalk.red(stats.compilation.errors))
  })

  try {
    await serverPromise
    await clientPromise
    await generateStaticHTML()
    logMessage('Done!', 'info')
  } catch (error) {
    logMessage(error, 'error')
  }
}

build()
