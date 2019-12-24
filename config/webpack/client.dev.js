import * as webpack from 'webpack'
import WriteFileWebpackPlugin from 'write-file-webpack-plugin'
import baseConfig from './client.base'

const config = {
  ...baseConfig,
  plugins: [
    new WriteFileWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    ...baseConfig.plugins
  ],
  mode: 'development',
  performance: {
    hints: false
  }
}

export default config
