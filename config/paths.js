const PATH = require('path')
const FS = require('fs')

const appDirectory = FS.realpathSync(process.cwd())
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath)

/**
 * @typedef {Object} Structure
 * @property {string} appHtml Path to HTML template for client-only build
 * @property {string} clientBuild Path to client side bundled code
 * @property {string} serverBuild Path to server side bundled code
 * @property {string} dotenv Path to environment variables
 * @property {string} src Path to source directory
 * @property {string} srcClient Path to the source of the client side code
 * @property {string} srcServer Path to the source of the server side code
 * @property {string} srcShared Path to the source of the shared code
 * @property {string} locales Path to the translations
 * @property {string} scripts Path to the scripts directory
 * @property {string} config Path to the config directory
 * @property {string} publicPath Main URL path
 * @property {Object[]} [resolveModules] List of modules
 */

/**
 * @type {Structure}
 */
const paths = {
  appHtml: resolveApp('config/webpack/template.html'),
  clientBuild: resolveApp('dist/client'),
  serverBuild: resolveApp('dist/server'),
  dotenv: resolveApp('.env'),
  src: resolveApp('src'),
  srcClient: resolveApp('src/client'),
  srcServer: resolveApp('src/server'),
  srcShared: resolveApp('src/shared'),
  locales: resolveApp('src/shared/i18n/locales'),
  scripts: resolveApp('scripts'),
  config: resolveApp('config'),
  publicPath: '/initial-setup/'
}

paths.resolveModules = [
  paths.srcClient,
  paths.srcServer,
  paths.srcShared,
  paths.src,
  paths.config,
  paths.scripts,
  'node_modules'
]

module.exports = paths
