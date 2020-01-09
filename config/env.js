const CP = require('child_process')
const FS = require('fs')
const paths = require('./paths')

if (!process.env.NODE_ENV) {
  throw new Error('To continue process.env.NODE_ENV must be initialised.')
}

/**
 * Gets a string from the hash of the commit
 * Usage: mostly for browser caching of static resources
 */
const commit = CP.execSync('git rev-parse HEAD')
  .toString()
  .trim()

/**
 * Gets a version from the current tag
 * Usage: display version for error monitoring (e.g. Sentry)
 */
const version = CP.execSync('git describe --abbrev=0 --tags')
  .toString()
  .trim()

// Get paths depending on possible .env file names
const dotenvFiles = [
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
  process.env.NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean)

dotenvFiles.forEach(dotenvFile => {
  if (FS.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile
    })
  }
})

let raw, stringified

module.exports = () => {
  if (typeof raw === 'object' || typeof stringified === 'object') {
    return { raw, stringified }
  }
  // Define env vars you want to use in your client-side here
  raw = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'http://localhost',
    COMMIT: commit,
    VERSION: version
  }

  // Stringify all values for Webpack DefinePlugin
  stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return { raw, stringified }
}
