const chalk = require('chalk')

const logMessage = (message, level = 'info') => {
  const color =
    level === 'error'
      ? 'red'
      : level === 'warning'
        ? 'yellow'
        : level === 'info'
          ? 'blue'
          : 'white'
  console.log(`[${new Date().toISOString()}]`, chalk[color](message))
}

const compilerPromise = (name, compiler) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling `)
    })
    compiler.hooks.done.tap(name, stats => {
      if (!stats.hasErrors()) {
        return resolve(logMessage(`[${name}] is successfully compiled `))
      }
      return reject(new Error(`Failed to compile ${name}`))
    })
  })
}

const clientOnly = () => process.argv.includes('--client-only')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  clientOnly,
  compilerPromise,
  logMessage,
  sleep
}
