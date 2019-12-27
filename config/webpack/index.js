const babelConfigForTooling = require('../../babel.config').env.tooling

// Use babel on the fly
require('@babel/register')({
  ...babelConfigForTooling
})

module.exports = require('./main.js')
