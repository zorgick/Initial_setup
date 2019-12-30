const webpack = require('webpack')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const baseConfig = require('./client.base')

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...baseConfig.plugins
  ],
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false
  }
}

module.exports = config
