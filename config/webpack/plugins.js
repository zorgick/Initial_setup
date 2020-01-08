const PATH = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin';)
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const { clientOnly } = require('scripts/utils')
const paths = require('config/paths')
const envBuilder = require('config/env')

const env = envBuilder()

const isProfilerEnabled = () => process.argv.includes('--profile')

const shared = []

const client = [
  /**
   * Do not generate html file if ssr is enabled
   */
  clientOnly() &&
    new HtmlWebpackPlugin({
      filename: PATH.join(paths.clientBuild, 'index.html'),
      inject: true,
      template: paths.appHtml
    }),
  new CaseSensitivePathsPlugin(),
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true'
  }),
  new ManifestPlugin({ fileName: 'manifest.json' }),
  isProfilerEnabled() && new webpack.debug.ProfilingPlugin(),
  new LoadablePlugin()
].filter(Boolean)

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false'
  }),
  /**
   * We should make sure to have our locales in shared/i18n/locales
   * ready at build time.
   * They are then copied into the server build folder so they can be
   * accessed via i18next-fetch and
   * our custom /locales/:locale/:namespace endpoint.
   */
  new CopyPlugin([
    {
      from: paths.locales,
      to: PATH.join(paths.serverBuild, 'locales'),
      ignore: ['*.missing.json']
    }
  ])
]

module.exports = {
  shared,
  client,
  server
}
