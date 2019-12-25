// import React = require('react')
const PATH = require('path')
const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const bodyParser = require('body-parser')
const { getTraslation } = require('server/mdwr/i18nBackend')
const paths = require('../../config/paths')

require('dotenv').config()

const app = express()

// For production use Nginx for static assets
if (process.env.NODE_ENV === 'development') {
  app.use(
    paths.publicPath,
    express.static(PATH.join(paths.clientBuild, paths.publicPath))
  )
}
console.log(process.env.NODE_ENV)

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Better with Nginx as well:
app.get('/locales/:locale/:ns.json', getTraslation)

app.listen(process.env.PORT || 8500, () => {
  console.log(
    `[${new Date().toISOString()}]`,
    chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
  )
})

module.exports = app
