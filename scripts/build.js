require('module-alias/register')
const rimraf = require('rimraf')
const paths = require('config/paths')
const { clientOnly } = require('scripts/utils')

rimraf.sync(paths.clientBuild)
rimraf.sync(paths.serverBuild)

if (clientOnly()) {
  require('./build-client')
} else {
  require('./build-ssr')
}
