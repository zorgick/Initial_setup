const CP = require('child_process')

/**
 * Gets a string from the hash of the commit
 * Usage: mostly for browser caching of static resources
 */
const commit = CP.execSync('git rev-parse HEAD')
  .toString()
  .trim()

const version = CP.execSync('git describe --abbrev=0 --tags')
  .toString()
  .trim()

let raw, stringified

module.exports = () => {
  if (typeof raw === 'object' || typeof stringified === 'object') {
    return { raw, stringified }
  }
  // define env vars you want to use in your client app here
  raw = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'http://localhost',
    COMMIT: commit,
    VERSION: version
  }

  // Stringify all values so we can feed into Webpack DefinePlugin
  stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return { raw, stringified }
}
