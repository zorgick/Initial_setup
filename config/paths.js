import * as PATH from 'path'
import * as FS from 'fs'

const appDirectory = FS.realpathSync(process.cwd())
const resolveApp = relativePath => PATH.resolve(appDirectory, relativePath)

/**
 * @typedef {Object} Structure
 * @property {string} appHtml HTML template for client-only build
 * @property {string} clientBuild Client side bundled code
 * @property {string} serverBuild Server side bundled code
 * @property {string} dotenv Environment variables
 * @property {string} src Source directory
 * @property {string} srcClient Module with the client side code
 * @property {string} srcServer Module with the server side code
 * @property {string} srcShared Module with the common code
 * @property {string} locales Directory with translations
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
  publicPath: '/initial-setup/'
}

paths.resolveModules = [
  paths.srcClient,
  paths.srcServer,
  paths.srcShared,
  paths.src,
  'node_modules'
]

export default paths
