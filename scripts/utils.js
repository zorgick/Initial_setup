import * as chalk from 'chalk'

export const logMessage = (message, level = 'info') => {
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

export const compilerPromise = (name, compiler) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      logMessage(`[${name}] Compiling `)
    })
    compiler.hooks.done.tap(name, stats => {
      if (!stats.hasErrors()) {
        return resolve()
      }
      return reject(new Error(`Failed to compile ${name}`))
    })
  })
}

export const clientOnly = () => process.argv.includes('--client-only')
