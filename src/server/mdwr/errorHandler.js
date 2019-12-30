const PATH = require('path')

const errorHandler = (err, req, res, next) =>
  res.status(404).json({
    status: 'error',
    message: err.message,
    stack:
      // print a nicer stack trace by splitting line breaks and making them array items
      process.env.NODE_ENV === 'development' &&
      (err.stack || '')
        .split('\n')
        .map(line => line.trim())
        .map(line => line.split(PATH.sep).join('/'))
        .map(line =>
          line.replace(
            process
              .cwd()
              .split(PATH.sep)
              .join('/'),
            '.'
          )
        )
  })

module.exports = errorHandler
