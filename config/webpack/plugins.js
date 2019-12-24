import * as PATH from 'path'
import * as webpack from 'webpack'
import ManifestPlugin from 'webpack-manifest-plugin'
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import paths from 'config/paths'
import { clientOnly } from 'scripts/utils'
import envBuilder from 'config/env'

const env = envBuilder()

const isProfilerEnabled = () => process.argv.includes('--profile')

export const shared = [
  // new MiniCssExtractPlugin({
  //   filename:
  //     env.raw.NODE_ENV === 'development' ? '[name].css' : '[name].[contenthash].css',
  //   chunkFilename:
  //     env.raw.NODE_ENV === 'development' ? '[id].css' : '[id].[contenthash].css',
  // }),
]

export const client = [
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
  isProfilerEnabled() && new webpack.debug.ProfilingPlugin()
].filter(Boolean)

export const server = [
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

export default {
  shared,
  client,
  server
}
