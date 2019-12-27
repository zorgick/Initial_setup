// import React = require('react')
const PATH = require('path')
const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const bodyParser = require('body-parser')
const manifestHelpers = require('express-manifest-helpers').default
const { getTraslation } = require('server/mdwr/i18nBackend')
const addStore = require('server/mdwr/addStore')
const errorHandler = require('server/mdwr/errorHandler')
const paths = require('../../config/paths')
const envBuilder = require('../../config/env')

const { raw } = envBuilder()
const { NODE_ENV, PORT } = raw
require('dotenv').config()

const app = express()

// For production use Nginx for static assets
if (NODE_ENV === 'development') {
  app.use(
    paths.publicPath,
    express.static(PATH.join(paths.clientBuild, paths.publicPath))
  )
}

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Better with Nginx as well:
app.get('/locales/:locale/:ns.json', getTraslation)

// Create a fresh, new Redux store instance on every request
app.use(addStore)

const manifestPath = PATH.join(paths.clientBuild, paths.publicPath)

app.use(
  manifestHelpers({
    manifestPath: `${manifestPath}/manifest.json`
  })
)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}]`,
    chalk.blue(`App is running: http://localhost:${PORT}`)
  )
})

module.exports = app
